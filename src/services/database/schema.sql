-- ═════════════════════════════════════════════════════════════════════════════
--  تِرياقي (Tiryāqi) — Master Relational Database Schema & System Architecture
--  الهيكل العلائقي الشامل لقاعدة البيانات (MySQL / MariaDB / SQLite)
--  يغطي وحدات: IoT، العتاد الذكي، الاشتراكات، الصيدليات الشريكة، والسلامة الطبية
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── 1. إدارة المستخدمين والملفات الصحية الأسرية ────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_members (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(64) NOT NULL, -- e.g. "أب", "أم", "ابنة"
    date_of_birth DATE,
    gender ENUM('male', 'female'),
    is_pregnant_or_lactating BOOLEAN DEFAULT FALSE,
    color VARCHAR(16) DEFAULT '#176B57',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS allergies (
    id VARCHAR(36) PRIMARY KEY,
    family_member_id VARCHAR(36) NOT NULL,
    substance_name VARCHAR(255) NOT NULL, -- e.g. "Penicillin", "NSAID"
    severity ENUM('MILD', 'MODERATE', 'SEVERE') DEFAULT 'SEVERE',
    reaction_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chronic_conditions (
    id VARCHAR(36) PRIMARY KEY,
    family_member_id VARCHAR(36) NOT NULL,
    condition_name VARCHAR(255) NOT NULL, -- e.g. "Hypertension", "Diabetes"
    diagnosed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE CASCADE
);

-- ─── 2. خزانة الأدوية والمخزون المنزلي ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    assigned_family_member_id VARCHAR(36),
    trade_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(128) NOT NULL,
    category ENUM('مزمنة', 'مسكنات', 'مضادات', 'فيتامينات ومكملات', 'طوارئ', 'أخرى') DEFAULT 'مسكنات',
    quantity INT NOT NULL DEFAULT 1,
    unit VARCHAR(32) DEFAULT 'عبوة',
    batch_number VARCHAR(128),
    storage_location VARCHAR(128) DEFAULT 'الرف العلوي',
    expiry_date DATE NOT NULL,
    instructions TEXT,
    is_prescription_required BOOLEAN DEFAULT FALSE,
    price_estimate DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_family_member_id) REFERENCES family_members(id) ON DELETE SET NULL
);

-- ─── 3. خزانة الأدوية الذكية وإنترنت الأشياء (Hardware & IoT) ───────────────
CREATE TABLE IF NOT EXISTS device_types (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(128) NOT NULL, -- e.g. "خزانة تِرياقي الذكية", "مستشعر ESP32 المناخي"
    model_code VARCHAR(64) UNIQUE NOT NULL,
    hardware_version VARCHAR(32) NOT NULL,
    firmware_version VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS smart_devices (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    device_type_id VARCHAR(36) NOT NULL,
    device_uid VARCHAR(128) UNIQUE NOT NULL, -- MAC Address or Chip ID
    is_simulation BOOLEAN DEFAULT FALSE,
    connection_status ENUM('ONLINE', 'OFFLINE', 'SYNCING', 'ERROR') DEFAULT 'OFFLINE',
    battery_level INT DEFAULT 100,
    paired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ping_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_type_id) REFERENCES device_types(id)
);

CREATE TABLE IF NOT EXISTS device_credentials (
    id VARCHAR(36) PRIMARY KEY,
    device_id VARCHAR(36) NOT NULL,
    auth_token VARCHAR(255) NOT NULL,
    public_key TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES smart_devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lock_events (
    id VARCHAR(36) PRIMARY KEY,
    device_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    action ENUM('LOCKED', 'UNLOCKED', 'UNAUTHORIZED_ATTEMPT', 'MANUAL_BACKUP_OPEN') NOT NULL,
    method ENUM('APP', 'FINGERPRINT', 'MANUAL_KEY') NOT NULL,
    details TEXT,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_simulation BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (device_id) REFERENCES smart_devices(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id VARCHAR(36) PRIMARY KEY,
    device_id VARCHAR(36) NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity DECIMAL(5, 2) NOT NULL,
    reading_source ENUM('SIMULATION', 'HARDWARE_ESP32') DEFAULT 'SIMULATION',
    status ENUM('OPTIMAL', 'WARNING', 'ALERT') DEFAULT 'OPTIMAL',
    reading_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES smart_devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sensor_thresholds (
    id VARCHAR(36) PRIMARY KEY,
    device_id VARCHAR(36) NOT NULL,
    temp_min DECIMAL(5, 2) DEFAULT 15.00,
    temp_max DECIMAL(5, 2) DEFAULT 25.00,
    humidity_max DECIMAL(5, 2) DEFAULT 60.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES smart_devices(id) ON DELETE CASCADE
);

-- ─── 4. نموذج الاشتراكات والتجارة (Freemium & B2B) ──────────────────────────
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(36) PRIMARY KEY,
    plan_code VARCHAR(64) UNIQUE NOT NULL, -- e.g. "FREE", "PREMIUM_MONTHLY", "PREMIUM_YEARLY"
    name VARCHAR(128) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(8) DEFAULT 'SAR',
    billing_period ENUM('LIFETIME', 'MONTHLY', 'YEARLY') NOT NULL,
    max_family_members INT DEFAULT 5,
    smart_lock_enabled BOOLEAN DEFAULT FALSE,
    climate_monitoring_enabled BOOLEAN DEFAULT FALSE,
    ai_assistant_unlimited BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    status ENUM('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELED') DEFAULT 'TRIAL',
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    canceled_at TIMESTAMP NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subscription_id VARCHAR(36),
    gateway_provider VARCHAR(64) DEFAULT 'SANDBOX', -- e.g. "HyperPay", "Mada", "ApplePay"
    transaction_reference VARCHAR(128),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'SAR',
    status ENUM('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'INITIATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id)
);

-- ─── 5. شبكة الصيدليات الشريكة وإعادة الطلب (B2B E-Commerce) ────────────────
CREATE TABLE IF NOT EXISTS partner_pharmacies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    delivery_fee DECIMAL(10, 2) DEFAULT 12.00,
    est_delivery_minutes INT DEFAULT 45,
    commission_percentage DECIMAL(5, 2) DEFAULT 8.00,
    is_open BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 4.80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    pharmacy_id VARCHAR(36) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    platform_commission DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING_PHARMACY', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') DEFAULT 'PENDING_PHARMACY',
    payment_status ENUM('UNPAID', 'PAID_ON_DELIVERY', 'PAID_ONLINE') DEFAULT 'PAID_ON_DELIVERY',
    has_prescription_attachment BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pharmacy_id) REFERENCES partner_pharmacies(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    dosage VARCHAR(128),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ─── 6. محرك السلامة السريرية وسجلات الطوارئ (Clinical Safety) ─────────────
CREATE TABLE IF NOT EXISTS safety_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    family_member_id VARCHAR(36),
    event_type ENUM('RED_FLAG_CIRCUIT_BREAKER', 'ALLERGY_CONFLICT_BLOCKED', 'DRUG_INTERACTION_FLAGGED'),
    trigger_detail TEXT NOT NULL,
    action_taken VARCHAR(255) NOT NULL, -- e.g. "997 Ambulance prompt", "Prevented Save"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_consents (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    consent_type VARCHAR(64) NOT NULL, -- e.g. "MEDICAL_DISCLAIMER", "EMERGENCY_LOCKOUT"
    is_granted BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(64),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
