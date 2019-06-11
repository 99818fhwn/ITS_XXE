-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 11. Jun 2019 um 23:53
-- Server-Version: 10.3.15-MariaDB
-- PHP-Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `smarthomedb`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fridges`
--
-- Erstellt am: 11. Jun 2019 um 21:18
-- Zuletzt aktualisiert: 11. Jun 2019 um 21:48
--

CREATE TABLE `fridges` (
  `fridge_id` int(11) NOT NULL,
  `home_id` int(11) DEFAULT NULL,
  `is_on` tinyint(1) DEFAULT 0,
  `temperature` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- RELATIONEN DER TABELLE `fridges`:
--   `home_id`
--       `homes` -> `home_id`
--

--
-- Daten für Tabelle `fridges`
--

INSERT INTO `fridges` (`fridge_id`, `home_id`, `is_on`, `temperature`) VALUES
(1, 1, 1, 11),
(2, 2, 0, 19),
(3, 4, 1, 7);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `homes`
--
-- Erstellt am: 11. Jun 2019 um 14:40
--

CREATE TABLE `homes` (
  `home_id` int(11) NOT NULL,
  `adress` varchar(60) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- RELATIONEN DER TABELLE `homes`:
--

--
-- Daten für Tabelle `homes`
--

INSERT INTO `homes` (`home_id`, `adress`) VALUES
(1, NULL),
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL),
(6, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lights`
--
-- Erstellt am: 11. Jun 2019 um 16:05
-- Zuletzt aktualisiert: 11. Jun 2019 um 21:41
--

CREATE TABLE `lights` (
  `light_id` int(11) NOT NULL,
  `light_name` varchar(255) NOT NULL DEFAULT 'Light',
  `house_id` int(11) NOT NULL,
  `is_on` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONEN DER TABELLE `lights`:
--

--
-- Daten für Tabelle `lights`
--

INSERT INTO `lights` (`light_id`, `light_name`, `house_id`, `is_on`) VALUES
(1, 'Bathroom', 1, 1),
(2, 'Kitchen', 1, 1),
(3, 'Cellar', 2, 0),
(4, 'Kitchen', 2, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `products`
--
-- Erstellt am: 11. Jun 2019 um 14:40
-- Zuletzt aktualisiert: 11. Jun 2019 um 16:42
--

CREATE TABLE `products` (
  `fridge_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `start_weight` int(11) NOT NULL,
  `current_weight` int(11) NOT NULL,
  `expire_date` text COLLATE latin1_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- RELATIONEN DER TABELLE `products`:
--   `fridge_id`
--       `fridges` -> `fridge_id`
--

--
-- Daten für Tabelle `products`
--

INSERT INTO `products` (`fridge_id`, `product_id`, `start_weight`, `current_weight`, `expire_date`) VALUES
(1, 1, 100, 56, '\n          2019-10-07'),
(3, 1, 12, 1, '2019-10-01'),
(2, 2, 500, 456, '\n          2019-07-12'),
(1, 12, 500, 300, '2020-04-12'),
(1, 45, 100, 100, '2019-07-25');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--
-- Erstellt am: 11. Jun 2019 um 14:40
-- Zuletzt aktualisiert: 11. Jun 2019 um 20:41
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(30) COLLATE latin1_general_ci NOT NULL,
  `password` varchar(60) COLLATE latin1_general_ci NOT NULL,
  `uuid` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `home_id` int(11) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- RELATIONEN DER TABELLE `users`:
--   `home_id`
--       `homes` -> `home_id`
--

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`user_id`, `name`, `password`, `uuid`, `home_id`, `is_admin`) VALUES
(0, 'gunter', 'pw', NULL, 1, 0),
(1, 'hugo', 'hugoBest', 'f6fd3eb8-f84f-419f-ba0a-9f82296547fe', 1, 1),
(2, 'hugos_wife', 'hugos_wifeBest', NULL, 1, 0),
(3, 'lisa', 'password', '34775db8-4b5b-4557-900b-7c79aa3373ff', 1, 0),
(4, 'milla', 'something', 'be131a6f-2472-413e-b99a-c0d03c6a6611', 2, 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `fridges`
--
ALTER TABLE `fridges`
  ADD PRIMARY KEY (`fridge_id`),
  ADD KEY `home_id` (`home_id`);

--
-- Indizes für die Tabelle `homes`
--
ALTER TABLE `homes`
  ADD PRIMARY KEY (`home_id`);

--
-- Indizes für die Tabelle `lights`
--
ALTER TABLE `lights`
  ADD PRIMARY KEY (`light_id`);

--
-- Indizes für die Tabelle `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`,`fridge_id`),
  ADD KEY `fridge_id` (`fridge_id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `home_id` (`home_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `lights`
--
ALTER TABLE `lights`
  MODIFY `light_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `fridges`
--
ALTER TABLE `fridges`
  ADD CONSTRAINT `fridges_ibfk_1` FOREIGN KEY (`home_id`) REFERENCES `homes` (`home_id`);

--
-- Constraints der Tabelle `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`fridge_id`) REFERENCES `fridges` (`fridge_id`);

--
-- Constraints der Tabelle `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`home_id`) REFERENCES `homes` (`home_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
