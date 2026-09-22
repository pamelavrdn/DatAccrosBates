// =================== IMPORTATIONS ===================
// *** CSS ***
import "./gymnasteTable.css";
// *** REACT ***
import React, { useEffect, useState } from "react";
// *** MATERIAL-UI ***
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// *** DONNEES ***
import { formatDatePoint, formatDateSlash } from "../../../data/Data";

const GymnasteTable = ({
  gymnastes,
  concours,
  addGymnaste,
  removeGymnaste,
  inscrits,
  tableType,
  equipesData,
  setEquipesData,
}) => {
  /* =================== DELCARATION DES VARIABLES =================== */

  // *** CONSTANTES ***
  const [categoriesData] = useState([
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "CD",
    "CH",
  ]);
  const [modifiable, setModifiable] = useState(false);

  // *** ETATS FILTRES ET TRIE ***
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("nom");
  const [selectedSexe, setSelectedSexe] = useState("T");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoriesFilter, setSelectedCategoriesFilter] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  // *** ETATS PAGINATION ***
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  // *** ETATS SELECTION ET DEPLACEMENT ***
  const [selectAll, setSelectAll] = useState(false);
  const [selectedGymnastes, setSelectedGymnastes] = useState([]);
  // *** ETATS INFORMATIONS GYMNASTES ***
  const [gymnastesInfosInscription, setGymnastesInfosInscription] = useState(
    {}
  );
  const [gymnastesToRemove, setGymnastesToRemove] = useState([]);

  const handleAddEquipe = () => {
    setEquipesData((prevEquipesData) => {
      // Créer un tableau pour stocker les numéros d'équipe existants
      const equipeNumbers = prevEquipesData.map(
        (equipeData) => equipeData.equipe
      );

      // Trouver le premier numéro d'équipe manquant (par exemple s'il y a équipe 1 et 3, renvoyer 2)
      // Si pas de trous, ça reverra le prochain numéro d'équipe
      let newEquipeNum = 1;
      while (equipeNumbers.includes(newEquipeNum)) {
        newEquipeNum++;
      }

      // Créer la nouvelle équipe avec le numéro d'équipe manquant
      const newEquipe = { equipe: newEquipeNum, gymnastes: [] };

      // Ajouter la nouvelle équipe et trier le tableau dans l'ordre croissant des numéros d'équipe
      const updatedEquipesData = [...prevEquipesData, newEquipe].sort(
        (a, b) => a.equipe - b.equipe
      );

      // Retourner le nouveau tableau d'équipes avec la nouvelle équipe ajoutée et triée
      return updatedEquipesData;
    });
  };

  useEffect(() => {
    if (!addGymnaste) {
      // Si on est dans le tableau des inscrits, on affiche tous les gymnastes sans filtre
      setSelectedCategoriesFilter(categoriesData);
    }
    if (concours.equipe) {
      // Supprimer le champ "equipe" de chaque objet dans gymnastesInfosInscription
      const updatedGymnastesInfosInscription = { ...gymnastesInfosInscription };
      Object.keys(updatedGymnastesInfosInscription).forEach((key) => {
        delete updatedGymnastesInfosInscription[key].equipe;
      });

      // Mettre à jour gymnastesInfosInscription avec les objets mis à jour
      setGymnastesInfosInscription(updatedGymnastesInfosInscription);

      // Récupérer les donnnées dans equipesData (les numéros d'équipes)
      const newData = equipesData.map((equipeData) => ({
        equipe: equipeData.equipe,
        gymnastes: [], // Vide les gymnastes parce qu'on les ajoute dans la condition suivante
      }));

      // Récupérer les gymnastes inscrits, en excluant ceux à retirer
      const gymnastesInscritsSansSuppression = inscrits.filter(
        (gymnaste) => !gymnastesToRemove.some((g) => g.id === gymnaste.id)
      );

      // Ajouter les gymnastes aux équipes existantes
      gymnastesInscritsSansSuppression.forEach((gymnaste) => {
        if (gymnaste.equipe && gymnaste.equipe !== 0) {
          // Si le gymnaste a déjà une équipe
          // Ajouter les gymnastes à l'équipe correspondante
          const equipeIndex = newData.findIndex(
            (data) => data.equipe === gymnaste.equipe
          );
          if (equipeIndex !== -1) {
            newData[equipeIndex].gymnastes.push(gymnaste);
          } else {
            newData.push({ equipe: gymnaste.equipe, gymnastes: [gymnaste] });
          }
        } else {
          // Vérifier si l'équipe 0 existe déjà
          const equipeZeroIndex = newData.findIndex(
            (data) => data.equipe === 0
          );
          if (equipeZeroIndex !== -1) {
            newData[equipeZeroIndex].gymnastes.push(gymnaste);
          } else {
            // Si l'équipe 0 n'existe pas, la créer et y ajouter le gymnaste
            newData.push({ equipe: 0, gymnastes: [gymnaste] });
          }
        }
      });

      // Trier newData par ordre croissant de numéro d'équipe
      newData.sort((a, b) => a.equipe - b.equipe);

      setEquipesData(newData);
    }
  }, [inscrits]);

  const handleDeleteEquipe = async (equipeId) => {
    console.log("EquipeId", equipeId);

    // mettre à jour les gymnastes qui étaient dans léquipe en utilisant removeGymnaste
    const gymnastesToRemove = equipesData.find(
      (equipeData) => equipeData.equipe === equipeId
    ).gymnastes;

    // on garde une trace des gymnastes à retirer
    setGymnastesToRemove(gymnastesToRemove);

    try {
      // Supprimer tous les gymnastes de l'équipe (sans actualiser la liste des inscrits)
      await Promise.all(
        gymnastesToRemove.map(async (gymnaste) => {
          await removeGymnaste(gymnaste);
          console.log("Gymnaste retiré :", gymnaste);
        })
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe", error);
    }

    setGymnastesToRemove([]);

    // supprimer l'équipe de equipesData $
    const newEquipesData = equipesData.filter(
      (equipeData) => equipeData.equipe !== equipeId
    );
    setEquipesData(newEquipesData);
  };

  /* =================== FONCTIONS D'AIDE =================== */
  // *** FONCTION DE FILTRAGE ET TRIE DES GYMNASTES ***

  const handleCategoryFilterChange = (event) => {
    setSelectedCategoriesFilter(event.target.value);
  };

  const handleSort = (column) => {
    const newOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  const handleSexeFilter = (event) => {
    setSelectedSexe(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  /* =================== FILTRAGE DES GYMNASTES =================== */
  const filteredGymnastes = gymnastes
    ?.filter((gymnaste) => {
      return (
        (selectedSexe === "T" || gymnaste.sexe === selectedSexe) &&
        (searchQuery === "" ||
          gymnaste.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gymnaste.prenom.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategoriesFilter[0] === undefined ||
          selectedCategoriesFilter.length === 0 ||
          selectedCategoriesFilter.includes("C" + gymnaste.categorie))
      );
    })
    .sort((a, b) => {
      if (sortColumn === "nom") {
        return sortOrder === "asc"
          ? a.nom.localeCompare(b.nom)
          : b.nom.localeCompare(a.nom);
      } else if (sortColumn === "prenom") {
        return sortOrder === "asc"
          ? a.prenom.localeCompare(b.prenom)
          : b.prenom.localeCompare(a.prenom);
      } else if (sortColumn === "categorie") {
        return sortOrder === "asc"
          ? a.categorie.localeCompare(b.categorie)
          : b.categorie.localeCompare(a.categorie);
      }
      return 0;
    });
  const displayedGymnastes = filteredGymnastes?.slice(startIndex, endIndex);
  // ======================================================================

  // =================== GESTION DE LA SÉLECTION ===================
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedGymnastes(
      selectAll
        ? [] // Si tous les gymnastes étaient sélectionnés il faut les désélectionner
        : filteredGymnastes
            .filter((gymnaste) => {
              // Filtrer les gymnastes sélectionnables
              return (
                !inscrits.map((g) => g.id).includes(gymnaste.id) && // Exclure les gymnastes déjà inscrits
                concours.categories.includes(
                  gymnastesInfosInscription[gymnaste.id]?.categorieConcours ||
                    gymnaste.categorie
                ) // Inclure les gymnastes dont la catégorie de concours est autorisée
              );
            })
            .map((gymnaste) => gymnaste)
    );
  };

  // si tous les gymnastes sont sélectionnés, mettre à jour au changement des gymnastes filtrés
  useEffect(() => {
    if (selectAll) {
      setSelectedGymnastes(
        filteredGymnastes
          .filter((gymnaste) => {
            // Filtrer les gymnastes sélectionnables
            return (
              !inscrits.map((g) => g.id).includes(gymnaste.id) && // Exclure les gymnastes déjà inscrits
              concours.categories.includes(
                gymnastesInfosInscription[gymnaste.id]?.categorieConcours ||
                  gymnaste.categorie
              ) // Inclure les gymnastes dont la catégorie de concours est autorisée
            );
          })
          .map((gymnaste) => gymnaste)
      );
    }
  }, [filteredGymnastes]);

  // Fonction pour sélectionner/désélectionner un gymnaste individuel
  const handleSelectGymnaste = (gymnaste) => {
    setSelectAll(false); // Désélectionner "Sélectionner tout" si un gymnaste est sélectionné individuellement
    if (selectedGymnastes.includes(gymnaste)) {
      // Si le gymnaste est déjà sélectionné, le retirer de la liste
      setSelectedGymnastes(
        selectedGymnastes.filter((g) => g.id !== gymnaste.id)
      );
    } else {
      // Sinon, l'ajouter à la liste
      setSelectedGymnastes([...selectedGymnastes, gymnaste]);
    }
  };

  const handleAddGymnaste = async (gymnaste, gymnasteInfos) => {
    console.log("Ajouter le gymnaste", gymnaste);
    try {
      await addGymnaste(gymnaste, gymnasteInfos);
      // Une fois le gymnaste ajouté, filtrez selectedGymnastes pour le supprimer
      setSelectedGymnastes(
        selectedGymnastes.filter((g) => g.id !== gymnaste.id)
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du gymnaste", error);
    }
  };

  // Fonction pour déplacer les gymnastes sélectionnés
  const handleMoveSelected = async () => {
    console.log("Déplacer les gymnastes sélectionnés", selectedGymnastes);
    try {
      await Promise.all(
        // Ajouter chaque gymnaste sélectionné de façon asynchrone
        selectedGymnastes.map(async (gymnaste) => {
          const gymnasteInfos = gymnastesInfosInscription[gymnaste.id] || {};
          await addGymnaste(gymnaste, gymnasteInfos);
        })
      );
      // Une fois tous les gymnastes ajoutés, réinitialisez la sélection et le bouton de sélection
      setSelectedGymnastes([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Erreur lors du déplacement des gymnastes", error);
    }
  };
  // ======================================================================

  // =================== GESTION DE LA PAGINATION ===================
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSelectedCategoriesFilter([]);
    setSelectedSexe("T");
    setSearchQuery("");
    setFiltersApplied(false);
  };
  // ======================================================================

  // =================== USE EFFETS ===================
  useEffect(() => {
    if (
      selectedCategoriesFilter.length > 0 ||
      selectedSexe !== "T" ||
      searchQuery !== ""
    ) {
      setFiltersApplied(true);
    } else {
      setFiltersApplied(false);
    }
  }, [selectedCategoriesFilter, selectedSexe, searchQuery]);

  // Réinitialiser les gymnastes sélectionnés et leurs informations et la case à cocher "Sélectionner tout" lors du changement de concours
  useEffect(() => {
    if (!addGymnaste) {
      // Si on est dans le tableau des inscrits, on affiche tous les gymnastes sans filtre
      setSelectedCategoriesFilter(categoriesData);
    } else {
      const filteredCategories = concours.categories.map(
        (category) => "C" + category
      );
      const uniqueCategories = [...new Set(filteredCategories)];
      setSelectedCategoriesFilter(uniqueCategories);
    }

    // formatDatePoint(concours.dateInscription)  == 14.6.2024, il faut comparer avec new Date() (14.6.2021 > new Date())
    const [day, month, year] = formatDatePoint(concours.dateInscription).split(
      "."
    );
    const concoursDateInscription = new Date(year, month - 1, day);
    setModifiable(concoursDateInscription < new Date());

    setGymnastesInfosInscription({});
    setSelectedGymnastes([]);
    setSelectAll(false);
  }, [concours]);
  // ======================================================================

  /* =================== RENDU DE L'INTERFACE =================== */

  // Fonction pour afficher la liste déroulante des catégories
  const renderCategorieCell = (gymnaste) => {
    // tableau des gymnastes à ajouter
    if (addGymnaste !== false) {
      const gymnasteInfos = gymnastesInfosInscription[gymnaste.id] || {};
      const categorieConcours =
        gymnasteInfos.categorieConcours || gymnaste.categorie;

      const handleChange = (event) => {
        const newValue = event.target.value;
        setGymnastesInfosInscription({
          ...gymnastesInfosInscription,
          [gymnaste.id]: {
            ...gymnastesInfosInscription[gymnaste.id],
            categorieConcours: newValue,
            catSup:
              gymnaste.categorie === newValue
                ? false
                : gymnaste.catSup || false,
            // si la catégorie de concours est la même que la catégorie du gymnaste, catSup est faux
            // sinon on garde la valeur actuelle de catSup ou faux (défaut) si catSup n'existe pas
          },
        });
      };

      // Calcul de l'âge du gymnaste à partir de la date de naissance
      const timestampSeconds = gymnaste.dateNaissance.seconds;
      const dateNaissance = new Date(timestampSeconds * 1000);
      const aujourdHui = new Date();
      let age = aujourdHui.getFullYear() - dateNaissance.getFullYear();

      // Vérifier si l'anniversaire du gymnaste est déjà passé cette année
      const anniversairePasse =
        aujourdHui.getMonth() > dateNaissance.getMonth() ||
        (aujourdHui.getMonth() === dateNaissance.getMonth() &&
          aujourdHui.getDate() >= dateNaissance.getDate());

      // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
      if (!anniversairePasse) {
        age--;
      }

      //console.log("Age", age);
      // Filtrer les catégories disponibles pour le concours et pour le gymnaste
      const categorieDisponibles = concours.categories.filter((category) => {
        // Vérifier si la catégorie du gymnaste est "D" ou "H"
        if (gymnaste.categorie === "D") {
          // Si le gymnaste est en catégorie "D", il peut concourir en "D" ou "7"
          return category === "D" || category === "7";
        } else if (gymnaste.categorie === "H") {
          // Si le gymnaste est en catégorie "H", il peut concourir en "H" ou "7"
          return category === "H" || category === "7";
        } else {
          // Si le gymnaste est dans une autre catégorie
          if (gymnaste.sexe === "F" && age >= 22) {
            // Si le gymnaste est de sexe "F" et a 22 ans ou plus, il peut concourir en "D"
            return category === "D";
          } else if (gymnaste.sexe === "M" && age >= 28) {
            // Si le gymnaste est de sexe "H" et a 28 ans ou plus, il peut concourir en "H"
            return category === "H";
          } else {
            // Si le gymnaste est dans une catégorie autre que "D" ou "H"
            // Retourner true si la catégorie est supérieur ou égale à celle du gymnaste
            return parseInt(gymnaste.categorie) <= parseInt(category);
          }
        }
      });

      // Vérifier si la catégorie du gymnaste n'est pas déjà incluse dans les catégories disponibles
      if (!categorieDisponibles.includes(gymnaste.categorie)) {
        // Ajouter la catégorie du gymnaste aux catégories disponibles
        categorieDisponibles.push(gymnaste.categorie);
        categorieDisponibles.sort();
      }

      return (
        <FormControl>
          <Select
            value={categorieConcours}
            onChange={(event) => handleChange(event)}
            style={{
              backgroundColor:
                categorieConcours === gymnaste.categorie
                  ? "var(--backColorSelect)"
                  : "transparent",
              borderRadius: "5px",
              color: "var(--text-100)",
            }}
          >
            {categorieDisponibles.map((category) => (
              <MenuItem
                key={category}
                value={category}
                style={{
                  backgroundColor:
                    category === gymnaste.categorie ? "#dedeff" : "transparent",
                }}
              >
                {"C" + category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else {
      // tableau des inscrits
      return (
        <Typography
          className={
            gymnaste?.categorieConcours === gymnaste?.categorie ? "" : "cat"
          }
        >
          {"C" + gymnaste.categorieConcours}
        </Typography>
      );
    }
  };

  const renderCheckCell = (gymnaste) => {
    // tableau des gymnastes à ajouter
    if (addGymnaste !== false) {
      const gymnasteInfos = gymnastesInfosInscription[gymnaste.id] || {};
      const catSup = gymnasteInfos.catSup || false;

      // pour condidtionner l'affichage de la checkbox
      const isCategorieConcoursNull =
        gymnasteInfos.categorieConcours === null ||
        gymnasteInfos.categorieConcours === undefined;
      const isCategorieConcoursSameAsCategorie =
        gymnasteInfos.categorieConcours === gymnaste.categorie;
      const isGymnasteInDHCategory =
        gymnaste.categorie === "D" || gymnaste.categorie === "H";

      const handleCheckboxChange = (event) => {
        const newValue = event.target.checked;
        setGymnastesInfosInscription({
          ...gymnastesInfosInscription,
          [gymnaste.id]: {
            ...gymnasteInfos,
            catSup: newValue,
          },
        });
      };

      return (
        <>
          {!isCategorieConcoursNull &&
          !isCategorieConcoursSameAsCategorie &&
          !isGymnasteInDHCategory ? (
            <Checkbox checked={catSup} onChange={handleCheckboxChange} />
          ) : (
            <Typography>non</Typography>
          )}
        </>
      );
    } else {
      // tableau des inscrits
      return (
        <Typography className={gymnaste?.categorieSup && "catSup"}>
          {gymnaste?.categorieSup ? "oui" : "non"}
        </Typography>
      );
    }
  };

  const renderBtnCell = (gymnaste) => {
    const gymnasteInfos = gymnastesInfosInscription[gymnaste.id] || {};
    const isCatGymAutorise = concours.categories.includes(
      gymnasteInfos.categorieConcours || gymnaste.categorie
    );
    const isAlreadyInscrit = inscrits.map((g) => g.id).includes(gymnaste.id);

    return (
      <>
        {addGymnaste && (
          <Button
            className="add-btn"
            variant="contained"
            color="primary"
            onClick={() => {
              handleAddGymnaste(gymnaste, gymnasteInfos);
            }}
            disabled={isAlreadyInscrit || !isCatGymAutorise || modifiable}
            style={{ fontSize: "12px" }}
          >
            Ajouter
          </Button>
        )}
        {removeGymnaste && (
          <Button
            className="remove-btn"
            variant="contained"
            color="secondary"
            onClick={() => removeGymnaste(gymnaste)}
            style={{ fontSize: "12px" }}
          >
            Retirer
          </Button>
        )}
      </>
    );
  };

  const renderSelectEquipe = (gymnaste) => {
    const gymnasteInfos = gymnastesInfosInscription[gymnaste.id] || {};
    const equipe =
      equipesData.find((data) => data.equipe === gymnasteInfos.equipe)
        ?.equipe || 0;

    const handleSelectEquipe = (e) => {
      const newValue = parseInt(e.target.value);
      setGymnastesInfosInscription({
        ...gymnastesInfosInscription,
        [gymnaste.id]: {
          ...gymnasteInfos,
          equipe: newValue,
        },
      });
    };

    return (
      <Select
        value={equipe}
        onChange={handleSelectEquipe}
        style={{
          color: "var(--text-100)",
          backgroundColor: "var(--bg-200)",
          borderRadius: "5px",
        }}
      >
        <MenuItem key={0} value={0}>
          Sans équipe
        </MenuItem>
        {equipesData.map(
          (equipe) =>
            equipe.equipe !== 0 && (
              <MenuItem key={equipe.equipe} value={equipe.equipe}>
                Equipe {equipe.equipe}
              </MenuItem>
            )
        )}
      </Select>
    );
  };

  // ======================================================================

  // =================== RENDU DE L'INTERFACE ===================
  return (
    <>
      {/* Section de filtrage et tri */}
      {addGymnaste && (
        <>
          {/* =================== SECTION DE FILTRAGE ET TRI =================== */}
          <div className="filterUI">
            <div className="filter-flex">
              <TextField
                label="Rechercher"
                variant="filled"
                value={searchQuery}
                onChange={handleSearch}
                // size="small"
                InputLabelProps={{
                  style: { color: "var(--text-100)" },
                }}
                style={{
                  fontSize: "14px",
                  color: "var(--text-100)",
                  backgroundColor: "var(--bg-200)",
                }}
              />
              <FormControl variant="filled">
                <InputLabel
                  id="sexe-filter-label"
                  style={{ color: "var(--text-100)" }}
                >
                  Sexe
                </InputLabel>
                <Select
                  labelId="sexe-filter-label"
                  id="sexe-filter"
                  value={selectedSexe}
                  onChange={handleSexeFilter}
                  label="Filtrer par sexe"
                  style={{
                    fontSize: "14px",
                    width: "100px",
                    color: "var(--text-100)",
                    backgroundColor: "var(--bg-200)",
                  }}
                >
                  <MenuItem value="T">Tous</MenuItem>
                  <MenuItem value="F">Femmes</MenuItem>
                  <MenuItem value="M">Hommes</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="filled" style={{ marginBottom: "20px" }}>
                <InputLabel
                  id="category-filter-label"
                  style={{ color: "var(--text-100)" }}
                >
                  Catégorie
                </InputLabel>

                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  multiple
                  value={selectedCategoriesFilter}
                  onChange={handleCategoryFilterChange}
                  label="Filtrer par catégorie"
                  style={{
                    minWidth: "120px",
                    fontSize: "14px",
                    color: "var(--text-100)",
                    backgroundColor: "var(--bg-200)",
                  }}
                  MenuProps={{
                    getContentAnchorEl: null,
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                  }}
                >
                  {/* Générer les options de sélection en fonction des catégories disponibles */}
                  {categoriesData.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearFilters}
                disabled={!filtersApplied} // Désactiver le bouton si aucun filtre n'est appliqué
                style={{ height: "30px" }}
                size="small"
              >
                Effacer
              </Button>
            </div>
          </div>
          {/* ====================================================================== */}
        </>
      )}
      {!addGymnaste && concours.equipe && (
        <Button
          onClick={() => handleAddEquipe()}
          style={{ marginBottom: "20px" }}
        >
          {"Ajouter une équipe"}
        </Button>
      )}
      <div>
        {/* Tableau des gymnastes */}
        <TableContainer
          component={Paper}
          style={{
            maxHeight: addGymnaste
              ? "calc(80vh - 200px)"
              : "calc(80vh - 150px)",
            overflowY: "auto",
            scrollbarWidth: "thin",
            backgroundColor: "var(--bg-100)",
          }}
        >
          {/* pour le tableau des gymnastes disponibles et pour le tableau des gymnastes inscrits sans concours par équipe*/}
          {(addGymnaste || (!addGymnaste && !concours.equipe)) && (
            <Table
              size="small"
              stickyHeader
              className={`gymnaste-table ${tableType}`}
            >
              {/*=================== EN-TÊTE DU TABLEAU ===================*/}
              <TableHead
                style={{
                  backgroundColor: "var(--bg-200)",
                  color: "var(--text-100)",
                }}
              >
                <TableRow>
                  {addGymnaste !== false && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        disabled={modifiable}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "nom"}
                      direction={sortOrder}
                      onClick={() => handleSort("nom")}
                    >
                      Nom
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "prenom"}
                      direction={sortOrder}
                      onClick={() => handleSort("prenom")}
                    >
                      Prénom
                    </TableSortLabel>
                  </TableCell>
                  {addGymnaste && <TableCell>Date de Naissance</TableCell>}
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === "categorie"}
                      direction={sortOrder}
                      onClick={() => handleSort("categorie")}
                    >
                      Catégorie
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Passage catégorie</TableCell>
                  {concours.equipe && addGymnaste && (
                    <TableCell>Equipe</TableCell>
                  )}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              {/*============================================================*/}
              {/*=================== CORPS DU TABLEAU ===================*/}

              <TableBody>
                {displayedGymnastes?.map((gymnaste) => (
                  <TableRow
                    key={gymnaste.id}
                    className={inscrits.includes(gymnaste) ? "inscrit" : ""}
                  >
                    {addGymnaste !== false && (
                      <TableCell padding="checkbox" disabled>
                        <Checkbox
                          checked={selectedGymnastes.includes(gymnaste)}
                          onChange={() => handleSelectGymnaste(gymnaste)}
                          disabled={
                            inscrits.map((g) => g.id).includes(gymnaste.id) || // Désactiver si le gymnaste est déjà inscrit
                            !concours.categories.includes(
                              gymnastesInfosInscription[gymnaste.id]
                                ?.categorieConcours || gymnaste.categorie
                            ) || // Désactiver si la catégorie sélectionnée du gymnaste n'est pas autorisée
                            modifiable // Désactiver si le concours n'est plus modifiable
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell>{gymnaste.nom}</TableCell>
                    <TableCell>{gymnaste.prenom}</TableCell>
                    {addGymnaste && (
                      <TableCell>
                        {formatDateSlash(gymnaste.dateNaissance)}
                      </TableCell>
                    )}
                    {/* <TableCell>{gymnaste.dateNaissance}</TableCell> */}
                    <TableCell>{renderCategorieCell(gymnaste)}</TableCell>
                    <TableCell>{renderCheckCell(gymnaste)}</TableCell>
                    {concours.equipe && addGymnaste && (
                      <TableCell>{renderSelectEquipe(gymnaste)}</TableCell>
                    )}
                    <TableCell>{renderBtnCell(gymnaste)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* pour le tableau des gymnastes inscrits dans un concours par équipe*/}
          {concours.equipe &&
            !addGymnaste &&
            // ======================== TABLEAU EQUIPES INSCRITES =================== //
            equipesData.map((equipeData) => (
              <Accordion key={equipeData.equipe}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${equipeData.equipe}-content`}
                  id={`panel${equipeData.equipe}-header`}
                  style={{
                    backgroundColor: "var(--bg-200)",
                    color: "var(--text-100)",
                  }}
                >
                  <Typography style={{ color: "var(--text-100)" }}>
                    {equipeData.equipe === 0
                      ? "Sans equipe - ("
                      : `Équipe ${equipeData.equipe} - (`}

                    <span
                      style={{
                        color:
                          equipesData.gymnastes?.length > 5
                            ? "red"
                            : "var(--text-100)",
                      }}
                    >
                      {equipeData.gymnastes.length}{" "}
                      {equipeData.gymnastes.length > 1
                        ? "gymnastes)"
                        : "gymnaste)"}
                    </span>
                  </Typography>

                  {equipeData.equipe !== 0 && (
                    <Button
                      className="remove-btn"
                      variant="contained"
                      color="secondary"
                      style={{ fontSize: "12px", marginLeft: "auto" }}
                      onClick={() => handleDeleteEquipe(equipeData.equipe)}
                    >
                      Supprimer
                    </Button>
                  )}
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    backgroundColor: "var(--bg-200)",
                    color: "var(--text-100)",
                  }}
                >
                  <Table
                    size="small"
                    stickyHeader
                    className={`gymnaste-table ${tableType}`}
                    style={{
                      color: "var(--text-100)",
                      backgroundColor: "var(--bg-200)",
                    }}
                  >
                    {/* En-tête du tableau */}
                    <TableHead>
                      {/* Colonnes */}
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Prénom</TableCell>
                        <TableCell>Catégorie</TableCell>
                        <TableCell>Passage catégorie</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    {/* Corps du tableau */}
                    <TableBody>
                      {equipeData.gymnastes.map((gymnaste) => (
                        <TableRow key={gymnaste.id}>
                          {addGymnaste !== false && (
                            <TableCell padding="checkbox" disabled>
                              <Checkbox
                                checked={selectedGymnastes.includes(
                                  gymnaste.id
                                )}
                                onChange={() =>
                                  handleSelectGymnaste(gymnaste.id)
                                }
                                disabled={inscrits
                                  .map((g) => g.id)
                                  .includes(gymnaste.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{gymnaste.nom}</TableCell>
                          <TableCell>{gymnaste.prenom}</TableCell>
                          {addGymnaste && (
                            <TableCell>
                              {formatDateSlash(gymnaste.dateNaissance)}
                            </TableCell>
                          )}
                          {/* <TableCell>{gymnaste.dateNaissance}</TableCell> */}
                          <TableCell>{renderCategorieCell(gymnaste)}</TableCell>
                          <TableCell>{renderCheckCell(gymnaste)}</TableCell>
                          <TableCell>{renderBtnCell(gymnaste)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ))}
          {/*============================================================*/}
        </TableContainer>
      </div>
      {/* ======================== BOUTTON DEPLACER GYMNASTE =================== */}
      {addGymnaste && (
        <Button
          className="move-btn"
          variant="contained"
          color="primary"
          onClick={handleMoveSelected}
          disabled={selectedGymnastes.length === 0 || modifiable} // Désactiver le bouton si aucun gymnaste n'est sélectionné
          style={{ marginTop: "20px" }}
        >
          {"Déplacer les sélectionnés (" + selectedGymnastes.length + ")"}
        </Button>
      )}
      {/* ====================================================================== */}

      {/* ======================== PAGINATION =================== */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredGymnastes?.length ? filteredGymnastes?.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ color: "var(--text-100)" }}
      />
      {/* ====================================================================== */}
    </>
  );
};

export default GymnasteTable;
