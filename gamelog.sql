-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2017 at 04:06 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gamelog`
--

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `player_No` int(11) NOT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `user_pass` char(32) DEFAULT NULL,
  `leftkey` char(1) DEFAULT NULL,
  `rightkey` char(1) DEFAULT NULL,
  `duckkey` char(1) DEFAULT NULL,
  `shootkey` char(1) DEFAULT NULL,
  `jumpkey` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`player_No`, `user_name`, `user_pass`, `leftkey`, `rightkey`, `duckkey`, `shootkey`, `jumpkey`) VALUES
(1, 'simon', 'b30bd351371c686298d32281b337e8e9', 'A', 'D', 'S', 'K', 'J'),
(2, 'kobe', '2357e8fb9945f0a2039a7093422a3dee', 'A', 'D', 'S', 'K', 'J'),
(3, 'joaquin', 'a6beca7f198112079f836a4e67cf4821', 'A', 'D', 'S', 'K', 'J');

-- --------------------------------------------------------

--
-- Table structure for table `saves`
--

CREATE TABLE `saves` (
  `save_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `date_saved` date NOT NULL,
  `time_saved` time NOT NULL,
  `level` int(11) NOT NULL,
  `checkpoint` int(11) NOT NULL,
  `lives` int(11) NOT NULL,
  `shield` tinyint(1) NOT NULL,
  `burst` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `saves`
--

INSERT INTO `saves` (`save_id`, `player_id`, `date_saved`, `time_saved`, `level`, `checkpoint`, `lives`, `shield`, `burst`) VALUES
(3, 1, '2017-03-20', '04:03:59', 3, 6, 3, 0, 0),
(4, 1, '2017-03-19', '15:17:16', 1, 0, 3, 0, 0),
(5, 1, '2017-03-19', '22:22:11', 1, 0, 2, 0, 0),
(7, 1, '2017-03-19', '23:14:34', 1, 2, 4, 0, 0),
(8, 1, '2017-03-20', '00:37:01', 1, 2, 1, 0, 0),
(9, 1, '2017-03-20', '01:08:41', 1, 1, 3, 0, 0),
(11, 1, '2017-03-20', '01:22:08', 2, 1, 1, 0, 0),
(12, 1, '2017-03-20', '01:28:38', 2, 0, 4, 0, 0),
(13, 1, '2017-03-20', '01:29:36', 1, 1, 2, 0, 0),
(14, 1, '2017-03-20', '08:47:48', 3, 0, 3, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`player_No`);

--
-- Indexes for table `saves`
--
ALTER TABLE `saves`
  ADD PRIMARY KEY (`save_id`),
  ADD KEY `player_id` (`player_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `player_No` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `saves`
--
ALTER TABLE `saves`
  MODIFY `save_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `saves`
--
ALTER TABLE `saves`
  ADD CONSTRAINT `saves_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_No`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
