const SEMESTER_DATA = {
  1: {
    name: "Semester 1",
    subjects: [
      {
        id: "ds",
        name: "Data Structures",
        code: "MCA101",
        materials: [
          {
            name: "Introduction to Data Structures.pdf",
            type: "pdf",
            size: "2.3 MB",
            uploadedBy: "Dr. Smith",
            date: "2024-01-15"
          },
          {
            name: "Arrays and Linked Lists.pptx",
            type: "pptx",
            size: "1.8 MB",
            uploadedBy: "Prof. Johnson",
            date: "2024-01-20"
          },
          {
            name: "Trees and Graphs Notes.docx",
            type: "docx",
            size: "1.2 MB",
            uploadedBy: "Senior Batch",
            date: "2024-01-25"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-02-10",
            marks: "25"
          },
          {
            name: "CA2 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-15",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-04-20",
            marks: "50"
          }
        ]
      },
      {
        id: "dbms",
        name: "Database Management Systems",
        code: "MCA102",
        materials: [
          {
            name: "DBMS Fundamentals.pdf",
            type: "pdf",
            size: "3.1 MB",
            uploadedBy: "Dr. Wilson",
            date: "2024-01-18"
          },
          {
            name: "SQL Tutorial Complete.pptx",
            type: "pptx",
            size: "2.7 MB",
            uploadedBy: "Prof. Davis",
            date: "2024-01-22"
          },
          {
            name: "Normalization Concepts.pdf",
            type: "pdf",
            size: "1.5 MB",
            uploadedBy: "Senior Batch",
            date: "2024-01-28"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-02-12",
            marks: "25"
          },
          {
            name: "CA2 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-18",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-04-22",
            marks: "50"
          }
        ]
      },
      {
        id: "se",
        name: "Software Engineering",
        code: "MCA103",
        materials: [
          {
            name: "SDLC Models Overview.pdf",
            type: "pdf",
            size: "2.8 MB",
            uploadedBy: "Dr. Brown",
            date: "2024-01-16"
          },
          {
            name: "Requirements Engineering.pptx",
            type: "pptx",
            size: "2.2 MB",
            uploadedBy: "Prof. Miller",
            date: "2024-01-24"
          },
          {
            name: "Testing Methodologies.docx",
            type: "docx",
            size: "1.7 MB",
            uploadedBy: "Senior Batch",
            date: "2024-01-30"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-02-08",
            marks: "25"
          },
          {
            name: "CA2 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-12",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-04-18",
            marks: "50"
          }
        ]
      },
      {
        id: "networks",
        name: "Computer Networks",
        code: "MCA104",
        materials: [
          {
            name: "Network Fundamentals.pdf",
            type: "pdf",
            size: "3.5 MB",
            uploadedBy: "Dr. Taylor",
            date: "2024-01-19"
          },
          {
            name: "OSI Model Detailed.pptx",
            type: "pptx",
            size: "2.9 MB",
            uploadedBy: "Prof. Anderson",
            date: "2024-01-26"
          },
          {
            name: "TCP-IP Protocol Suite.pdf",
            type: "pdf",
            size: "2.1 MB",
            uploadedBy: "Senior Batch",
            date: "2024-02-02"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-02-14",
            marks: "25"
          },
          {
            name: "CA2 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-20",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-04-24",
            marks: "50"
          }
        ]
      },
      {
        id: "math",
        name: "Discrete Mathematics",
        code: "MCA105",
        materials: [
          {
            name: "Set Theory and Logic.pdf",
            type: "pdf",
            size: "2.6 MB",
            uploadedBy: "Dr. White",
            date: "2024-01-17"
          },
          {
            name: "Graph Theory Basics.pptx",
            type: "pptx",
            size: "2.4 MB",
            uploadedBy: "Prof. Garcia",
            date: "2024-01-23"
          },
          {
            name: "Combinatorics Problems.pdf",
            type: "pdf",
            size: "1.9 MB",
            uploadedBy: "Senior Batch",
            date: "2024-01-29"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-02-09",
            marks: "25"
          },
          {
            name: "CA2 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-14",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-04-19",
            marks: "50"
          }
        ]
      },
      {
        id: "programming",
        name: "Programming Fundamentals",
        code: "MCA106",
        materials: [
          {
            name: "C Programming Complete.pdf",
            type: "pdf",
            size: "4.2 MB",
            uploadedBy: "Dr. Lee",
            date: "2024-01-21"
          },
          {
            name: "Data Types and Operators.pptx",
            type: "pptx",
            size: "1.6 MB",
            uploadedBy: "Prof. Martinez",
            date: "2024-01-27"
          },
          {
            name: "Practice Problems Set.pdf",
            type: "pdf",
            size: "2.8 MB",
            uploadedBy: "Senior Batch",
            date: "2024-02-03"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-02-11",
            marks: "25"
          },
          {
            name: "CA2 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-16",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-04-21",
            marks: "50"
          }
        ]
      }
    ]
  },
  2: {
    name: "Semester 2",
    subjects: [
      {
        id: "oop",
        name: "Object Oriented Programming",
        code: "MCA201",
        materials: [
          {
            name: "OOP Concepts in Java.pdf",
            type: "pdf",
            size: "3.8 MB",
            uploadedBy: "Dr. Kumar",
            date: "2024-02-15"
          },
          {
            name: "Inheritance and Polymorphism.pptx",
            type: "pptx",
            size: "2.5 MB",
            uploadedBy: "Prof. Sharma",
            date: "2024-02-20"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-10",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-05-15",
            marks: "50"
          }
        ]
      }
    ]
  },
  3: {
    name: "Semester 3",
    subjects: [
      {
        id: "oop3",
        name: "Advanced Object Oriented Programming",
        code: "MCA301",
        materials: [
          {
            name: "Advanced OOP Concepts.pdf",
            type: "pdf",
            size: "3.8 MB",
            uploadedBy: "Dr. Kumar",
            date: "2024-02-15"
          },
          {
            name: "Design Patterns.pptx",
            type: "pptx",
            size: "2.5 MB",
            uploadedBy: "Prof. Sharma",
            date: "2024-02-20"
          }
        ],
        questionPapers: [
          {
            name: "CA1 Question Paper - 2024.pdf",
            type: "ca",
            date: "2024-03-10",
            marks: "25"
          },
          {
            name: "End Semester Exam - 2024.pdf",
            type: "ese",
            date: "2024-05-15",
            marks: "50"
          }
        ]
      }
    ]
  }
};

export default SEMESTER_DATA;