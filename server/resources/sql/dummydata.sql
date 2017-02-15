INSERT INTO User (cid, personnumber, email, firstname, lastname, password)
VALUES
  ("krookr","9303161112","guskrooro@student.gu.se","robert","krook","dawg"),
  ("eriklj","9103162736","erik@eriksmail.dank.memes","erik","jungmark","magicgod"),
  ("th4m","9011052736","th4m@philips.mail","philip","tham","cakeml"),
  ("alekaar","9105122837","alekaar@4chan.org","aleksander","stern kaar","nasty"),
  ("adamin","9205281753","adam@adams.mail","adam","ITkille","lovegit");

INSERT INTO Student (cid, profile)
VALUES
  ("krookr","i am so dank man its unbelievable bruh"),
  ("eriklj", "i nib"),
  ("th4m", "cakeml pls"),
  ("alekaar", "you kids want some candy?");

INSERT INTO Admin (cid)
VALUES
  ("adamin");

INSERT INTO Course (gencode, coursecode, name, description, admin)
VALUES
  ("abcde","DIT126", "webapp", "a course where you learn how to properly develop full-stack web applications.","adamin"),
  ("abcdf", "DIT231", "programming language technology", "A course where you use haskell <3", "adamin");

INSERT INTO Question (question, weight, course)
VALUES
  ("How tall is Robert?", 1.0, "abcde"),
  ("How tall is Erik?", 0.33, "abcdf"),
  ("How tall is Aleksander?", 0.33, "abcdf"),
  ("How tall is Adam?", 0.33, "abcdf");

INSERT INTO RegisteredAt (student, course, score)
VALUES
  ("krookr", "abcde", 100),
  ("th4m", "abcde", 100),
  ("alekaar", "abcdf", 100);

INSERT INTO Groups (id, course, student)
VALUES
  (1, "abcde", "krookr"),
  (1, "abcde", "th4m"),
  (2, "abcdf", "alekaar");
