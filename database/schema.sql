CREATE DATABASE robert_cat;

USE robert_cat;

-- Table to store languages
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    source_language_id INT NOT NULL,
    target_language_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (source_language_id) REFERENCES languages (id),
    FOREIGN KEY (target_language_id) REFERENCES languages (id)
);

CREATE TABLE translation_units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_text TEXT NOT NULL,
    translated_text TEXT DEFAULT NULL,
    source_language_id INT NOT NULL,
    target_language_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (source_language_id) REFERENCES languages (id),
    FOREIGN KEY (target_language_id) REFERENCES languages (id)
);

CREATE TABLE translation_unit_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    translation_id INT NOT NULL,
    translation_unit_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (translation_id) REFERENCES translations (id) ON DELETE CASCADE,
    FOREIGN KEY (translation_unit_id) REFERENCES translation_units (id) ON DELETE RESTRICT
);

DELIMITER $$

CREATE TRIGGER before_delete_translation_unit_links
BEFORE DELETE ON translation_unit_links
FOR EACH ROW
BEGIN
    INSERT INTO translation_unit_links_history
    SET translation_id = OLD.translation_id,
        translation_unit_id = OLD.translation_unit_id;
END $$

DELIMITER ;

CREATE TABLE translation_unit_links_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    translation_id INT NOT NULL,
    translation_unit_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (translation_id) REFERENCES translations (id) ON DELETE RESTRICT,
    FOREIGN KEY (translation_unit_id) REFERENCES translation_units (id) ON DELETE RESTRICT
);