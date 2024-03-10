INSERT INTO roles (id, role_name) VALUES
(01, 'Guest'),
(21, 'Patient'),
(41, 'Doctor'),
(161, 'Administrator');

INSERT INTO categories(id, category_name) VALUES
(1, 'General'),
(2, 'Alternative Medicine');

INSERT INTO specialties(specialty_name, category_id) VALUES
('Dental Care', 1),
('Chiropractic Services', 1),
('Physiotherapy', 1),
('Eye Care', 1),
('Acupuncture', 2),
('Chinese Medicine', 2),
('Homeopathy', 2),
('Reiki', 2);

INSERT INTO users(first_name, last_name, phone_number, email_address, password_hash, password_salt, role_id, is_email_confirmed, status) VALUES
('Admin', 'Admin', '1111111111', 'admin@salusconnect.in', 'Q3YvHH13ge8bkeK6DEM0IeosK1A03kFQw281DeGGE79I4Rtn3wyz4GpBlye87rOueTO0WYKvnlwDuE1pGmMlPA==', 'CasuTvBzGlSWS4mtYWbDB3atHQOnlSgV02qsQ0+XNvnhZ5J9HT7NmXTavJ4KSnpF8Ff1OIDvCBY1g1hWl4TQiZ2iJ1NBNczzW72Qx8TF3qJ+pN/NdaVfxIBN4eYjz9mH+dZi5AkmylmunSDJqVZGKr4EQnOZAOQLVWVKhTKfDT8=', 161, true, 'Active'::userstatus);
// Welcome!23

insert into holidays (hday_date, hday_name) values
('1900-01-01', 'New Year''s Day'),
('1900-04-02', 'Good Friday'),
('1900-05-01', 'Labour Day'),
('1900-12-25', 'Christmas Day');
