drop trigger if exists Groups.group_check;

drop table User, Student, Admin, Course, Question, Groups, RegisteredAt;

source create_tables.sql;
source views.sql;
source triggers.sql;
source dummydata.sql;
