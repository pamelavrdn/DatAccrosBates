import React from "react";
import { IoHomeOutline, IoPodiumOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { GoTrophy } from "react-icons/go";
import { PiPersonArmsSpread } from "react-icons/pi";
import { TfiWrite } from "react-icons/tfi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { GoDatabase } from "react-icons/go";

const elementsCommuns = [
  {
    title: "Accueil",
    icon: <IoHomeOutline />,
    link: "/accueil",
  },
  {
    title: "Résultats",
    icon: <GoTrophy />,
    link: "/resultats",
  },
];

export const SidebarPublic = [...elementsCommuns];

export const SidebarCoachClassique = [
  ...elementsCommuns,
  {
    title: "Incriptions",
    icon: <TfiWrite />,
    link: "/inscrire-gymnaste",
  },

  {
    title: "Gymnastes",
    icon: <PiPersonArmsSpread />,
    link: "/gerer-gymnastes",
  },
];

export const SidebarCoachPrivilegie = [
  ...SidebarCoachClassique,
  {
    title: "Coachs",
    icon: <BsPeople />,
    link: "/gerer-coachs",
  },

  {
    title: "Société",
    icon: <HiOutlineBuildingOffice />,
    link: "/gerer-societe",
  },
];

export const SidebarAdmin = [
  ...elementsCommuns,
  {
    title: "Concours",
    icon: <IoPodiumOutline />,
    children: [
      {
        title: "Créer/Modifier",
        link: "/creer-concours",
      },
      {
        title: "Importer/Exporter",
        link: "/importer-exporter",
      },
    ],
  },
  {
    title: "Comptes",
    icon: <BsPeople />,
    children: [
      {
        title: "Coachs",
        link: "/creer-coach",
      },
      {
        title: "Admins",
        link: "/creer-admin",
      },
    ],
  },
  {
    title: "Gérer",
    icon: <GoDatabase />,
    children: [
      {
        title: "Gymnastes",
        link: "/creer-gymnaste",
      },
      {
        title: "Sociétés",
        link: "/creer-societe",
      },
    ],
  },
];

export default {
  SidebarPublic,
  SidebarCoachClassique,
  SidebarCoachPrivilegie,
  SidebarAdmin,
};
