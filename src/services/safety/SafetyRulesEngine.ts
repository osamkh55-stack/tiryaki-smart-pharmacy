/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  تِرياقي (Tiryāqi) — محرك قواعد السلامة الطبية المستقل
 *  Clinical Safety Rules Engine (Deterministic Guardrails)
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ ملاحظة هندسية: هذا المحرك مستقل تماماً عن نماذج الذكاء الاصطناعي (LLMs)،
 *  ولا يمكن للنموذج تجاوزه أو الالتفاف عليه بمجرد توليد نصوص مقنعة.
 */

export interface SafetyCheckResult {
  isSafe: boolean;
  severity: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  title?: string;
  reason?: string;
  actionRequired?: string;
  emergencyPhone?: string;
  contraindicatedWith?: string;
}

// ─── 1. قاموس عائلات الحساسية الدوائية والمواد المشتقة ─────────────────────
const ALLERGY_FAMILIES: Record<string, string[]> = {
  'بنسلين': [
    'بنسلين', 'penicillin', 'أموكسيسيلين', 'amoxicillin', 'أوجمنتين', 'augmentin',
    'أمبيسيلين', 'ampicillin', 'بيبراسيلين', 'piperacillin', 'كلوكساسيللين', 'cloxacillin'
  ],
  'سلفا': [
    'سلفا', 'sulfa', 'سولفوناميد', 'sulfonamide', 'سلفاميثوكسازول', 'sulfamethoxazole',
    'باكتريم', 'bactrim', 'سبترين', 'septrin'
  ],
  'مضادات الالتهاب غير الستيرويدية (nsaids)': [
    'بروفين', 'ibuprofen', 'إيبوبروفين', 'فولتارين', 'diclofenac', 'ديكلوفيناك',
    'نابروكسين', 'naproxen', 'كيتوبروفين', 'ketoprofen', 'أسبرين', 'aspirin', 'سيلكوكسيب', 'celecoxib'
  ],
  'أسبرين': [
    'أسبرين', 'aspirin', 'حمض أسيتيل ساليسيليك', 'acetylsalicylic'
  ]
};

// ─── 2. جدول التفاعلات والتداخلات الدوائية الخطيرة (Drug-Drug Interactions) ─
interface InteractionRule {
  drugA: string[];
  drugB: string[];
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
  title: string;
  explanation: string;
  clinicalAction: string;
}

const DRUG_INTERACTIONS: InteractionRule[] = [
  {
    drugA: ['إيبوبروفين', 'بروفين', 'ديكلوفيناك', 'فولتارين', 'ibuprofen', 'diclofenac'],
    drugB: ['بيسوبرولول', 'كونكور', 'أملوديبين', 'bisoprolol', 'concor', 'amlodipine', 'إنالابريل'],
    severity: 'MODERATE',
    title: 'تعارض مسكنات NSAIDs مع أدوية الضغط',
    explanation: 'تناول مضادات الالتهاب غير الستيرويدية بانتظام يُضعف كفاءة أدوية الضغط ويحبس السوائل.',
    clinicalAction: 'استخدم الباراسيتامول (بانادول) كبديل آمن لتسكين الألم بعد استشارة الطبيب.'
  },
  {
    drugA: ['وارفارين', 'warfarin'],
    drugB: ['أسبرين', 'aspirin', 'إيبوبروفين', 'بروفين', 'فولتارين', 'diclofenac'],
    severity: 'CRITICAL',
    title: 'خطر نزيف حاد وشديد',
    explanation: 'مزيج مسكنات NSAIDs أو الأسبرين مع مسيلات الدم يضاعف احتمالية حدوث نزيف هضمي أو دماغي.',
    clinicalAction: 'يُمنع منعاً باتاً تناول المسكن دون إشراف طبي عاجل.'
  },
  {
    drugA: ['ميتفورمين', 'جلوكوفاج', 'metformin'],
    drugB: ['صبغات الأشعة المعالجة باليود', 'iodinated contrast'],
    severity: 'HIGH',
    title: 'خطر الحماض اللبني والفشل الكلوي',
    explanation: 'تفاعل الميتفورمين مع الصبغات الوريدية قد يسبب اعتلالاً كلوياً حاداً.',
    clinicalAction: 'يجب إيقاف الميتفورمين قبل الفحص بـ 48 ساعة بإشراف الطبيب المعالج.'
  }
];

// ─── 3. موانع الاستعمال المرتبطة بالأمراض المزمنة ───────────────────────────
interface ChronicContraindication {
  conditionKeywords: string[];
  restrictedDrugs: string[];
  warningMessage: string;
}

const CHRONIC_CONTRAINDICATIONS: ChronicContraindication[] = [
  {
    conditionKeywords: ['ضغط الدم', 'ارتفاع الضغط', 'hypertension'],
    restrictedDrugs: ['سودوإيفيدرين', 'pseudoephedrine', 'أدوية الاحتقان الفموية'],
    warningMessage: 'أدوية علاج الاحتقان المحتوية على سودوإيفيدرين ترفع ضغط الدم بشكل مفاجئ وقد تسبب أزمة فرط ضغط الدم.'
  },
  {
    conditionKeywords: ['قرحة المعدة', 'نزيف هضمي', 'peptic ulcer'],
    restrictedDrugs: ['بروفين', 'فولتارين', 'أسبرين', 'ibuprofen', 'diclofenac', 'aspirin'],
    warningMessage: 'مضادات الالتهاب غير الستيرويدية تهيج بطانة المعدة وتزيد خطر النزيف الهضمي.'
  },
  {
    conditionKeywords: ['الربو', 'asthma'],
    restrictedDrugs: ['أسبرين', 'aspirin', 'حاصرات بيتا غير الانتقائية'],
    warningMessage: 'حوالي 10-20% من مرضى الربو يعانون من حساسية مفرطة وتشنج قصبي حاد عند تناول الأسبرين.'
  }
];

// ─── 4. مؤشرات الطوارئ وعلامات الخطر (Safety Red Flags) ────────────────────
const EMERGENCY_RED_FLAGS: { keywords: string[]; title: string; advice: string }[] = [
  {
    keywords: ['ألم بالصدر', 'الم في الصدر', 'ضغط على الصدر', 'ثقل بالصدر', 'ألم يمتد للكتف أو الفك'],
    title: 'اشتباه بأزمة قلبية حادة (Acute Coronary Syndrome)',
    advice: 'لا تنتظر ولا تتناول مسكنات عادية. اتصل بالإسعاف (997) فوراً واجلس في وضع مستريح.'
  },
  {
    keywords: ['صعوبة بالتنفس', 'كتمة شديدة', 'اختناق', 'ازرقاق الشفاه', 'عجز عن التنفس'],
    title: 'فشل تنفسي أو أزمة ربو حادة',
    advice: 'استخدم بخاخ الإسعاف المخصص إن وُجد واطلب الإسعاف فوراً دون تأخير.'
  },
  {
    keywords: ['تورم اللسان', 'انتفاخ الحلق', 'صعوبة بالبلع', 'طفح جلدي مفاجئ بعد الدواء'],
    title: 'صدمة حساسية مفرطة (Anaphylaxis)',
    advice: 'حالة طبية طارئة تهدد مجرى التنفس. توجه فوراً لأقرب طوارئ أو استخدم قلم إبينفرين إن وُصف لك.'
  },
  {
    keywords: ['فقدان وعي', 'اغماء مفاجئ', 'تشنجات', 'صرع', 'عدم استجابة'],
    title: 'فقدان الوعي أو تشنج عصبي حاد',
    advice: 'ضع المريض على جانبه (وضعية الإفاقة) لمنع الاختناق ولا تضع أي شيء في فمه واتصل بـ 997.'
  },
  {
    keywords: ['صداع مفاجئ عنيف', 'ثقل باللسان', 'اعوجاج بالوجه', 'ضعف في اليد أو القدم'],
    title: 'اشتباه بسكتة دماغية (FAST Symptoms)',
    advice: 'الوقت حاسم جداً لخلايا الدماغ. انقل المريض فوراً لأقرب مركز طوارئ مجهز بالأشعة المقطعية.'
  }
];

export class ClinicalSafetyEngine {
  /**
   * فحص تعارض الدواء مع حساسية الفرد المسجلة
   */
  static checkAllergy(drugNameOrActive: string, userAllergies: string[]): SafetyCheckResult {
    const drugLower = drugNameOrActive.toLowerCase();

    for (const allergy of userAllergies) {
      const allergyKey = allergy.toLowerCase();
      // فحص القاموس المعياري
      for (const [family, members] of Object.entries(ALLERGY_FAMILIES)) {
        if (allergyKey.includes(family)) {
          for (const member of members) {
            if (drugLower.includes(member)) {
              return {
                isSafe: false,
                severity: 'CRITICAL',
                title: '⛔ حظر طبي صريح: تعارض مع حساسية مسجلة',
                reason: `هذا الدواء (${drugNameOrActive}) ينتمي إلى أو يحتوي على مشتقات (${family}) والتي يعاني الفرد من حساسية مسجلة تجاهها.`,
                actionRequired: 'يُمنع تناول هذا الدواء منعاً باتاً منعاً لحدوث صدمة حساسية أو مضاعفات مهددة للحياة.',
                contraindicatedWith: family
              };
            }
          }
        }
      }

      // فحص مباشر بالاسم
      if (drugLower.includes(allergyKey) || allergyKey.includes(drugLower)) {
        return {
          isSafe: false,
          severity: 'CRITICAL',
          title: '⛔ حظر طبي: تطابق مباشر مع سجل الحساسية',
          reason: `الدواء يتطابق مباشرة مع حساسية (${allergy}) المسجلة في ملف المستخدم.`,
          actionRequired: 'يُحظر صرف أو تناول هذا الدواء ويجب تسجيل دواء بديل تحت إشراف طبيب.',
          contraindicatedWith: allergy
        };
      }
    }

    return { isSafe: true, severity: 'SAFE' };
  }

  /**
   * فحص التداخلات الدوائية مع الأدوية التي يتناولها الفرد حالياً
   */
  static checkInteractions(newDrugActive: string, currentDrugsActive: string[]): SafetyCheckResult {
    const newLower = newDrugActive.toLowerCase();

    for (const currentDrug of currentDrugsActive) {
      const currentLower = currentDrug.toLowerCase();

      for (const rule of DRUG_INTERACTIONS) {
        const matchA = rule.drugA.some(d => newLower.includes(d));
        const matchB = rule.drugB.some(d => currentLower.includes(d));
        const reverseMatchA = rule.drugA.some(d => currentLower.includes(d));
        const reverseMatchB = rule.drugB.some(d => newLower.includes(d));

        if ((matchA && matchB) || (reverseMatchA && reverseMatchB)) {
          return {
            isSafe: false,
            severity: rule.severity,
            title: rule.title,
            reason: rule.explanation,
            actionRequired: rule.clinicalAction,
            contraindicatedWith: currentDrug
          };
        }
      }
    }

    return { isSafe: true, severity: 'SAFE' };
  }

  /**
   * فحص تعارض الدواء مع الأمراض المزمنة
   */
  static checkChronicContraindications(drugActive: string, chronicConditions: string[]): SafetyCheckResult {
    const drugLower = drugActive.toLowerCase();

    for (const condition of chronicConditions) {
      for (const rule of CHRONIC_CONTRAINDICATIONS) {
        const matchesCondition = rule.conditionKeywords.some(k => condition.toLowerCase().includes(k));
        const matchesDrug = rule.restrictedDrugs.some(d => drugLower.includes(d));

        if (matchesCondition && matchesDrug) {
          return {
            isSafe: false,
            severity: 'HIGH',
            title: `تحذير استخدام مع مرض (${condition})`,
            reason: rule.warningMessage,
            actionRequired: 'لا تستخدم هذا الدواء إلا إذا وافق طبيبك المعالج على الجرعة وفترة الاستخدام.',
            contraindicatedWith: condition
          };
        }
      }
    }

    return { isSafe: true, severity: 'SAFE' };
  }

  /**
   * خوارزمية كسر الدائرة وعلامات الخطر الطارئة (Safety Red Flags)
   */
  static evaluateRedFlags(symptomText: string): SafetyCheckResult {
    const textLower = symptomText.toLowerCase();

    for (const flag of EMERGENCY_RED_FLAGS) {
      for (const keyword of flag.keywords) {
        if (textLower.includes(keyword)) {
          return {
            isSafe: false,
            severity: 'CRITICAL',
            title: `🚨 علامة خطر أحمر: ${flag.title}`,
            reason: `الأعراض الموصوفة تتطلب تدخلاً طبياً مستعجلاً ولا تحتمل المعالجة المنزلية بالأدوية العادية.`,
            actionRequired: flag.advice,
            emergencyPhone: '997'
          };
        }
      }
    }

    return { isSafe: true, severity: 'SAFE' };
  }
}
