CREATE TABLE IF NOT EXISTS User (
  cid VARCHAR(20) PRIMARY KEY,
  personnumber TEXT(10) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  firstname VARCHAR(15),
  lastname VARCHAR(20),
  password VARCHAR(60)
  );

CREATE TABLE IF NOT EXISTS Student (
  cid VARCHAR(20) PRIMARY KEY REFERENCES User(cid),
  profile VARCHAR(255)
  );

CREATE TABLE IF NOT EXISTS Admin (
  cid VARCHAR(20) PRIMARY KEY REFERENCES User(cid)
  );

CREATE TABLE IF NOT EXISTS Course (
  gencode VARCHAR(5) PRIMARY KEY,
  coursecode TEXT(6) NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(512),
  admin VARCHAR(20) REFERENCES Admin(cid)
  );

CREATE TABLE IF NOT EXISTS Question (
  question VARCHAR(128),
  answer VARCHAR(128),
  weight FLOAT UNSIGNED,
  course VARCHAR(5) REFERENCES Course(gencode),
  PRIMARY KEY (question, answer, weight, course)
  );

CREATE TABLE IF NOT EXISTS Groups (
  id SMALLINT,
  course VARCHAR(5) REFERENCES Course(gencode),
  student VARCHAR(20) REFERENCES Student(cid),
  PRIMARY KEY (id, course, student)
  );

CREATE TABLE IF NOT EXISTS RegisteredAt (
  student VARCHAR(20) REFERENCES Student(cid),
  course VARCHAR(5) REFERENCES Course(gencode),
  score SMALLINT,
  PRIMARY KEY (student, course)
  );
