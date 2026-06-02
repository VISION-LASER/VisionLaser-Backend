CREATE TABLE `actualites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_actualite` varchar(500) DEFAULT NULL,
  `video_actualite` varchar(500) DEFAULT NULL,
  `date_publication` date DEFAULT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenoms` varchar(255) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `confirm_password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `bilans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `date_demande` date DEFAULT NULL,
  `statut` enum('en_attente','valide','refuse') DEFAULT 'en_attente',
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `commentaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `commentaire` text NOT NULL,
  `date_commentaire` datetime DEFAULT NULL,
  `actualite_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `contact_patient` (
  `id` int(11) NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Prenom` varchar(100) NOT NULL,
  `Telephone` varchar(20) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `Message` text NOT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `equipements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(150) NOT NULL,
  `desc_equipement` text,
  `image_equipement` varchar(255) DEFAULT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `faq` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `reponse_faq` text NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `horaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `jour` varchar(50) NOT NULL,
  `ouverture` time DEFAULT NULL,
  `fermeture` time DEFAULT NULL,
  `ferme` tinyint(1) DEFAULT '0',
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `statut` enum('non_lu','lu') DEFAULT 'non_lu',
  `nom_patient` varchar(150) DEFAULT NULL,
  `email_patient` varchar(150) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `date_demande` date DEFAULT NULL,
  `message` text,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `patients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenoms` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `confirm_password` varchar(255) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `reactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type_reaction` enum('like','love','wow') DEFAULT 'like',
  `date_reaction` datetime DEFAULT NULL,
  `actualite_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `rendez_vous` (
  `id` int(11) NOT NULL,
  `Nom` varchar(100) NOT NULL,
  `Prenom` varchar(100) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `Telephone` varchar(20) NOT NULL,
  `Date_naissance` date DEFAULT NULL,
  `Motif_consultation` varchar(100) NOT NULL,
  `info_supplementaire` text,
  `date_creneau` date NOT NULL,
  `heure_creneau` varchar(10) NOT NULL,
  `status` enum('pending','confirmed','refused','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tarifs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `technique` varchar(150) NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `note` text,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `actualites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_actualites_admin` (`admin_id`);

ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `bilans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bilans_patient` (`patient_id`);

ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commentaires_actualite` (`actualite_id`),
  ADD KEY `fk_commentaires_patient` (`patient_id`);

ALTER TABLE `contact_patient`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `equipements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_equipements_admin` (`admin_id`);

ALTER TABLE `faq`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_faq_admin` (`admin_id`);

ALTER TABLE `horaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_horaires_admin` (`admin_id`);

ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notifications_patient` (`patient_id`);

ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reactions_actualite` (`actualite_id`),
  ADD KEY `fk_reactions_patient` (`patient_id`);

ALTER TABLE `rendez_vous`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tarifs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tarifs_admin` (`admin_id`);

ALTER TABLE `actualites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `bilans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `commentaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `contact_patient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `equipements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `faq`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `horaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `patients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `reactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `rendez_vous`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `tarifs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `actualites`
  ADD CONSTRAINT `fk_actualites_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

ALTER TABLE `bilans`
  ADD CONSTRAINT `fk_bilans_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

ALTER TABLE `commentaires`
  ADD CONSTRAINT `fk_commentaires_actualite` FOREIGN KEY (`actualite_id`) REFERENCES `actualites` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commentaires_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

ALTER TABLE `equipements`
  ADD CONSTRAINT `fk_equipements_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

ALTER TABLE `faq`
  ADD CONSTRAINT `fk_faq_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

ALTER TABLE `horaires`
  ADD CONSTRAINT `fk_horaires_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

ALTER TABLE `reactions`
  ADD CONSTRAINT `fk_reactions_actualite` FOREIGN KEY (`actualite_id`) REFERENCES `actualites` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reactions_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

ALTER TABLE `tarifs`
  ADD CONSTRAINT `fk_tarifs_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;
COMMIT;
