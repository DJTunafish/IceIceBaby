/*
  These silly views are needed because sequelize does not support joins on tables.
*/

/*
  Each row in the table represents a student registered at a course, and that the student
  is not a part of any group in the course.
*/
CREATE OR REPLACE VIEW ungroupedStudents AS
    SELECT Student.cid,RegisteredAt.course, firstname,lastname,email,profile, score
    FROM Student,RegisteredAt,User
    WHERE
    Student.cid = RegisteredAt.student AND User.cid=Student.cid
    AND NOT EXISTS (SELECT * FROM Groups WHERE Groups.student = Student.cid AND Groups.course = RegisteredAt.course);

/*
  This view simply lists groupmembers and some additional information about them.
*/
CREATE OR REPLACE VIEW GroupMembers AS
    SELECT id,course,User.cid,firstname,lastname,email,profile
    FROM User,Student,Groups
    WHERE User.cid = Groups.student
    AND User.cid = Student.cid;
