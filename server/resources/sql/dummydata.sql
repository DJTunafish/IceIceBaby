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
  ("How good would you say you are at defining BNF grammar on a scale from 1 to 10?", 1.0, "abcde"),
  ("How good would you say you are at HTML/CSS on a scale from 1 to 10?", 0.33, "abcdf"),
  ("How good would you say you are at PHP on a scale from 1 to 10?", 0.33, "abcdf"),
  ("How good would you say you are at JavaScript on a scale from 1 to 10?", 0.33, "abcdf");

INSERT INTO RegisteredAt (student, course, score)
VALUES
  ("krookr", "abcde", 0),
  ("th4m", "abcde", 0),
  ("alekaar", "abcdf", 0);

INSERT INTO Groups (id, course, student)
VALUES
  (1, "abcde", "krookr"),
  (1, "abcde", "th4m"),
  (2, "abcdf", "alekaar");
