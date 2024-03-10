import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-faq',
  templateUrl: './patient-faq.component.html',
  styleUrls: ['./patient-faq.component.scss']
})
export class PatientFaqComponent implements OnInit {
  items: any[] = [
    {
      question: "Q. What can SimplyDoc do for me?",
      answer: "SimplyDoc is a medical appointment booking platform that allows Canadians to find and book medical appointments near where they are without having to make endless phone calls and checking for doctor’s availability."
    },
    {
      question: "Q. Is SimplyDoc free?",
      answer: "SimplyDoc is 100% free for patients.",
    },
    {
      question: "Q. What kind of medical providers are available?",
      answer: "SimplyDoc is onboarding medical practitioners in categories that are currently either not covered or only partially covered by provinces - dentists, physiotherapists, chiropracters, dietitians, opticians, optometrists etc. We will continue to expand these categories.",
    },
    {
      question: "Q. How do I find providers in my neighborhood?",
      answer: "When searching for a provider, enter your town/city or pin code and your  preferred date. If a provider in the category you are searching for is available, it will show up in the results.",
    },
    {
      question: "Q. Is it mandatory to create an account?",
      answer: "You are free to browse through the SimplyDoc website and check provider information or availabilities at any time. However, in order to book an appointment, you must either create an account or log into your existing SimplyDoc account first.",
    },
    {
      question: "Q. How do you secure my information?",
      answer: "Security and privacy are at the top of our mind all through the way. Therefore, there are multiple levels of checks and balances in place. If you’d like to read more, please visit the page on security by clicking here.",
    },
    {
      question: "Q. How do I know if a clinic or provider is accepting new patients?",
      answer: "When your search results appear, watch out for a  bar below the provider’s name saying “Accepting New Patients”. If it is green, they are Accepting New Patients.",
    },
    {
      question: "Q. What is Instant Book?",
      answer: "When you see Instant Book in green below a provider’s name, it means they have enabled a feature that approves patient appointments immediately. This means you no longer have to wait for an appointment confirmation.",
    },
    {
      question: "Q. Are cancellations or reschedules allowed?",
      answer: "We encourage you to keep your appointment times once booked. However, we also understand that you may not be able to make it to an appointment because of unforeseen circumstances. At those times, you can go log into your patient dashboard and cancel an appointment. Note that you will need to book a fresh appointment if you wish to see the same provider again.",
    },
    {
      question: "Q. How long before an appointment can I cancel?",
      answer: "Each medical provider has their own cancellation policy which allows you to cancel an appointment a certain number of days before your appointment is due. You may cancel an appointment through your SimplyDoc dashboard within the permitted window by your medical provider. Please consult your provider or the clinic directly in case cancellations are no longer allowed.",
    },
    {
      question: "Q. Can I book multiple appointments at once?",
      answer: "You may book upto 3 separate appointments with different providers at any point in time. Once those appointments are complete or have expired, you may book more.",
    },
    {
      question: "Q. How do I pay for my visit to the clinic?",
      answer: "You pay for your visit directly to the clinic.",
    },
    {
      question: "Q. Can I book appointments for other people?",
      answer: "You may currently book an appointment only for yourself. However, we are working to add new capabilities to SimplyDoc so that you may be able to book appointments for a family member. ",
    },
    {
      question: "Q. My medical provider canceled. What do I do?",
      answer: "Just like you may need to occasionally cancel an appointment because of an unplanned event. The same may be the case with your medical provider. You may want to consider booking another appointment with them or finding another provider who is available to see you on a day and time that works for you.",
    },
    {
      question: "Q. Can I reschedule my appointment?",
      answer: "Reschedules may be possible depending on your medical provider’s availability and the clinic’s rescheduling policy. Please call the the clinic directly if you would like to reschedule. Once your appointment is rescheduled by the clinic, the updated appointment time will show in your dashboard. You will also receive an email on your registered email address with the updated appointment information. ",
    },
    {
      question: "Q. What is the importance of the appointment ID?",
      answer: "Your appointment ID is a useful piece of information when you are communicating with your medical provider or the clinic. Each appoint ID is unique and an easy way for the clinic to track your appointment. Please use the appointment ID whenever you call or visit the clinic. ",
    },
    {
      question : "Q. What does the Fee in each treatment mean?",
      answer: "The fee indicated for each treatment is an estimate of what the medical provider typically charges for every session of that treatment. The actual fee charged from you may vary depending on what treatment is provided. Other factors, such as your insurance coverage, may determine what the final amount charged is.",
    },
    {
      question : "Q. Is there a way to rate my visit experience?",
      answer: "We will be adding a rating feature in a future update to SimplyDoc that will allow you to rate your visit and share your valuable experience or feedback with fellow Canadians.",
    }


  ];
  constructor() { }

  ngOnInit(): void {
  }

}
