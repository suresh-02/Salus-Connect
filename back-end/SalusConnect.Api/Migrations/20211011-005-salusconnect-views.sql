CREATE OR REPLACE VIEW vw_holidays AS
SELECT id, 
	(h.hday_date + make_interval(years := y.yr - extract(year from h.hday_date)::int))::date as hday_date,
	hday_name
FROM holidays h,
	(SELECT generate_series(date_part('year', CURRENT_DATE)::int, (date_part('year', CURRENT_DATE)+1)::int) as yr) as y
WHERE date_part('year', h.hday_date)=1900
UNION ALL 
SELECT id, hday_date, hday_name
FROM holidays h2 
WHERE date_part('year', h2.hday_date) in(date_part('year', CURRENT_DATE), date_part('year', CURRENT_DATE)+1)
ORDER BY hday_date;
