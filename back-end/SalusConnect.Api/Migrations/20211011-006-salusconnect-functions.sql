create or replace function fn_generate_random()
returns varchar
as
$BODY$
	select lpad(((random() * 999)::int)::text, 3, '0') || '-' || lpad(((random() * 9999)::int)::text, 4, '0');
$BODY$ language sql;


create or replace function fn_generate_appointment_code (
	first_name text,
	last_name text
)
returns text
as
$BODY$
begin
	return upper(left(trim(first_name), 1)) || upper(left(trim(last_name), 1)) || fn_generate_random();
end
$BODY$ language plpgsql;


create or replace function fn_generate_times(_time_range timerange, _duration_min int, _break_min int)
returns setof time as 
$BODY$
    begin        
      return query
	    select generate_series(
            current_date+lower(_time_range),
            current_date+upper(_time_range) - make_interval(mins => (_duration_min+_break_min)),
            make_interval(mins => (_duration_min+_break_min))
        )::time;
    end;
$BODY$ language 'plpgsql';
