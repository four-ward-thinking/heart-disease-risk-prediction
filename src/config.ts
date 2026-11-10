/**
 * Project configuration for Team 2, Four-Ward Thinking
 * B.Tech BT-A · SRM Institute of Science and Technology, Ramapuram
 */

export interface TeamMember {
  name: string;
  regNo: string;
  initials: string;
}

export interface AppConfig {
  projectName: string;
  teamName: string;
  course: string;
  institution: string;
  facultyGuide?: string; // Optional: render only if set
  presentationDate?: string; // Optional: render only if set
  teamMembers: TeamMember[];
}

export const config: AppConfig = {
  projectName: "Heart Disease Risk Prediction",
  teamName: "Team 2, Four-Ward Thinking",
  course: "B.Tech BT-A",
  institution: "SRM Institute of Science and Technology, Ramapuram",
  // Faculty guide and presentation date placeholders - leave empty or set as needed
  facultyGuide: undefined,
  presentationDate: undefined,
  teamMembers: [
    {
      name: "Mathivadanasree B",
      regNo: "RA2611009020012",
      initials: "MB",
    },
    {
      name: "Seetha Shree A",
      regNo: "RA2611009020041",
      initials: "SA",
    },
    {
      name: "Rithikaa J",
      regNo: "RA2611009020049",
      initials: "RJ",
    },
    {
      name: "Tharunika M.A",
      regNo: "RA2611009020051",
      initials: "TM",
    },
  ],
};

