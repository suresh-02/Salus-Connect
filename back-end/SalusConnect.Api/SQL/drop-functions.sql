drop function public.fn_appointment_getone(_appointment_id integer);
drop function public.fn_doctor_book_followup(_appointment_id integer, _appointment_date character varying, _appointment_time character varying, _treatment_id integer);
drop function public.fn_doctor_get_appointments(_doctor_id integer, _date_from text, _date_to text);
drop function public.fn_patient_book_appointment(_patient_id integer, _doctor_id integer, _appointment_date character varying, _appointment_time character varying, _symptoms text, _treatment_id integer, _is_created_by_phone boolean);
drop function public.fn_patient_get_appointments(_patient_id integer);
drop function public.fn_search_provider_slots2(_doctor_id integer, _treatment_id integer, _date text);
