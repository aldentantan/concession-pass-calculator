import { type ConcessionPass } from "../types";

export const PASS_OPTIONS: { [key: string]: ConcessionPass[] } = {
  undergrad: [
    {
      id: "no-pass",
      label: "No Pass",
      monthlyPrice: 0,
      description: "Pay per trip",
    },
    {
      id: "undergrad-bus",
      label: "Undergrad Bus Pass",
      monthlyPrice: 55.5,
      description: "Unlimited bus travel",
    },
    {
      id: "undergrad-mrt",
      label: "Undergrad MRT Pass",
      monthlyPrice: 48.0,
      description: "Unlimited MRT travel",
    },
    {
      id: "undergrad-hybrid",
      label: "Undergrad Hybrid Pass",
      monthlyPrice: 81.0,
      description: "Unlimited bus & MRT",
    },
  ],
  "primary-sch-student": [
    {
      id: "no-pass",
      label: "No Pass",
      monthlyPrice: 0,
      description: "Pay per trip",
    },
    {
      id: "pri-sch-bus",
      label: "Pri School Bus Pass",
      monthlyPrice: 24.0,
      description: "Unlimited bus travel",
    },
    {
      id: "pri-sch-mrt",
      label: "Pri School MRT Pass",
      monthlyPrice: 29.0,
      description: "Unlimited MRT travel",
    },
    {
      id: "pri-sch-hybrid",
      label: "Pri School Hybrid Pass",
      monthlyPrice: 39.0,
      description: "Unlimited bus & MRT",
    },
  ],
  "sec-sch/-diploma-student": [
    {
      id: "no-pass",
      label: "No Pass",
      monthlyPrice: 0,
      description: "Pay per trip",
    },
    {
      id: "sec-sch-diploma-bus",
      label: "Sec Sch/Diploma Bus Pass",
      monthlyPrice: 29.0,
      description: "Unlimited bus travel",
    },
    {
      id: "sec-sch-diploma-mrt",
      label: "Sec Sch/Diploma MRT Pass",
      monthlyPrice: 26.5,
      description: "Unlimited MRT travel",
    },
    {
      id: "sec-sch-diploma-hybrid",
      label: "Sec Sch/Diploma Hybrid Pass",
      monthlyPrice: 49.0,
      description: "Unlimited bus & MRT",
    },
  ],
  "adult": [
    {
      id: "no-pass",
      label: "No Pass",
      monthlyPrice: 0,
      description: "Pay per trip",
    },
    {
      id: "adult-hybrid",
      label: "Adult Hybrid Pass",
      monthlyPrice: 122.0,
      description: "Unlimited bus & MRT travel",
    },
  ]
};
