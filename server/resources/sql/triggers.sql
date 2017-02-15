delimiter //
CREATE TRIGGER group_check
BEFORE INSERT ON Groups
FOR EACH ROW
BEGIN
  IF NOT EXISTS (SELECT 1 FROM RegisteredAt WHERE RegisteredAt.student = NEW.student AND RegisteredAt.course = NEW.course)
    THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "Insert operation aborted; Student is not registered at the corresponding course";
  END IF;
END; //
delimiter ;
