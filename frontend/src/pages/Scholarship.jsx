import React, { useState } from "react";

/* NOTE: For the fonts to work correctly, ensure you have this in the <head> of your index.html file:
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono&family=Space+Grotesk&display=swap" rel="stylesheet">
*/

// --- Data for the top tabs (Content updated with step-by-step procedures) ---
const tabs = [
  {
    title: "Scholarships",
    sub: [
      {
        title: "National Scholarships",
        content: `A step-by-step guide to applying for National Scholarships:
        
1. Check Eligibility: Visit the National Scholarship Portal (NSP) to find schemes you qualify for based on your course, caste, and family income.
2. Gather Documents: Arrange your Aadhaar card, academic transcripts, income certificate, caste certificate (if applicable), and bank account details.
3. Register & Apply: Create an account on the NSP, fill out the application form carefully, and upload scanned copies of your documents.
4. Verification: Your institution will first verify your application. It then goes to the state and central ministry for final approval.
5. Fund Disbursement: Once sanctioned, the scholarship amount is sent directly to your bank account via Direct Benefit Transfer (DBT).`
      },
      {
        title: "State Scholarships",
        content: `A step-by-step guide to applying for State Scholarships:

1. Find Your State's Portal: Identify your state's specific scholarship portal (e.g., SSP for Karnataka, MahaDBT for Maharashtra).
2. Review Guidelines: Carefully read the eligibility criteria, focusing on domicile (residency) requirements and income limits.
3. Prepare Documents: In addition to standard documents, you will need a Domicile Certificate to prove your residency in the state.
4. Submit Application: Register on the state portal and submit your application well before the deadline.
5. Track Status: Regularly log in to the portal to track your application's verification and sanction status.`
      },
      {
        title: "Private Scholarships",
        content: `A step-by-step guide to applying for Private Scholarships:

1. Research Opportunities: Look for scholarships offered by corporations (e.g., Tata, Reliance Foundation) or your university's alumni network.
2. Tailor Your Application: Unlike government portals, these often require personal essays or statements of purpose. Tailor them for each application.
3. Get Recommendations: Request letters of recommendation from your teachers or mentors well in advance.
4. Submit & Follow Up: Each private scholarship has its own deadline and process. Submit your application and, if possible, follow up professionally.
5. Prepare for Interviews: Many private scholarships include an interview round as part of the selection process.`
      }
    ]
  },
  {
    title: "Loans",
    sub: [
      {
        title: "Education Loans",
        content: `A step-by-step guide to getting an Education Loan:

1. Compare Lenders: Compare interest rates, processing fees, and repayment terms from public banks (like SBI), private banks, and NBFCs.
2. Check Eligibility: The bank will assess the student's academic record and the co-applicant's (usually a parent) income and credit score.
3. Compile Documents: You'll need the college admission letter, fee structure, and KYC documents (Aadhaar, PAN) for both the student and co-applicant.
4. Submit to Bank: Apply through the bank's website or by visiting a branch. The bank will then perform a credit appraisal.
5. Sanction & Disbursement: Once approved, you'll receive a sanction letter. The tuition fee is typically paid directly to the institution.`
      },
      {
        title: "Low-Interest Loans",
        content: `A step-by-step guide to finding Low-Interest Loans:

1. Explore Government Schemes: Start by checking the Vidya Lakshmi Portal, which lists various government-subsidized loan schemes.
2. Verify Special Criteria: These loans are often reserved for students from specific economic backgrounds (EWS) or for premier institutions like IITs/IIMs.
3. Check for Interest Subsidy: In many schemes, the government pays the interest part of the loan while you are studying. Confirm if your loan qualifies.
4. Apply Through Designated Banks: These schemes are usually offered through public sector banks like Canara Bank or Bank of Baroda.
5. Follow Standard Procedure: The rest of the process (documentation, verification) is similar to a regular education loan.`
      },
      {
        title: "Private Bank Loans",
        content: `A step-by-step guide to getting a Private Bank Loan:

1. Get a Quote: Contact private banks (like HDFC, ICICI) or NBFCs (like Avanse) to get a detailed quote on interest rates and processing fees.
2. Digital Application: The application process is typically faster and can be completed online with digital document uploads.
3. Faster Verification: Private lenders often have a quicker verification and credit check process compared to public banks.
4. Understand All Charges: Be sure to ask about all associated costs, including processing fees, late payment penalties, and any mandatory insurance.
5. Rapid Disbursement: The key advantage is the speed. Once approved, the funds are often disbursed very quickly.`
      }
    ]
  }
];

export default function Scholarship() {
  const [activeTab, setActiveTab] = useState(0);
  const [openSub, setOpenSub] = useState(null);

  return (
    // Using the specified background color
    <div className="h-screen flex flex-col bg-gradient-to-b from-#DDF6D2 to-white">
      {/* Top Tabs */}
      <div className="flex gap-4 px-6 py-4 justify-center">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTab(index);
              setOpenSub(null);
            }}
            className={`px-6 py-3 text-xl font-serif transition-all duration-300 rounded-full shadow-md
              ${activeTab === index ? "scale-105" : "hover:scale-105"}`}
            style={{
              // Using the specified colors and font
              backgroundColor: activeTab === index ? "#DDF6D2" : "#ffffff",
              color: "#333",
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-#DDF6D2 to-white">
        <div
          className="rounded-xl shadow-lg p-8 transition-all duration-300 flex flex-col"
          style={{ backgroundColor: "#ffffff" }} // White card
        >
          <h1
            className="text-4xl font-bold mb-8"
            style={{ 
              color: "#333", 
              // Using the specified font for headlines
              fontFamily: "'Instrument Serif', serif" 
            }}
          >
            {tabs[activeTab].title}
          </h1>

          {/* Subheadings */}
          <div className="flex flex-col gap-6">
            {tabs[activeTab].sub.map((sub, subIndex) => {
              const isOpen = openSub === subIndex;
              return (
                <div key={subIndex} className="w-full">
                  <button
                    onClick={() => setOpenSub(isOpen ? null : subIndex)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-6 py-4 rounded-xl shadow-md text-xl font-medium transition-all duration-300 flex items-center justify-between"
                    style={{
                      backgroundColor: "#ECFAE5",
                      // Using the specified font
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "#333"
                    }}
                  >
                    <span>{sub.title}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Expandable Box */}
                  <div
                    className="mt-3 rounded-xl overflow-hidden transition-[max-height] duration-300"
                    style={{
                      maxHeight: isOpen ? "1000px" : "0px",
                    }}
                  >
                    <div
                      className="px-8 py-6 text-lg whitespace-pre-line" // whitespace-pre-line preserves newlines
                      style={{
                        backgroundColor: "#f8f8f8", // Grey background for content
                        // Using the specified font for code/content
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#555" // Grey text color
                      }}
                    >
                      {sub.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
