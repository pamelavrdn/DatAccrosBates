import csv
from faker import Faker
import random

fake = Faker('fr_FR')


def generate_gymnastes(sexe, count):
    gymnastes = []

    # Générer chaque attribut des gymnastes
    for _ in range(count):
        noFSG = str(random.randint(10000, 99999))
        nom = fake.last_name()
        prenom = fake.first_name_male() if sexe == 'M' else fake.first_name_female()
        dateNaissance = generate_birthdate()
        categorie = get_category(sexe, dateNaissance)
        idSociete = str(random.randint(1, 14)).zfill(2)  # ajout d'un 0 devant si moins de 2 chiffres

        gymnastes.append([noFSG, nom, prenom, sexe, dateNaissance, categorie, idSociete])

    return gymnastes


def generate_birthdate():
    # Plus de gymnastes jeunes (7 à 14 ans) que de gymnastes plus âgés (15 à 31 ans)
    # 7 et 31 ans choisis arbitrairement pour représenter une diversité d'âges
    if random.choice([True, True, False]):
        age_range = (7, 14)
    else:
        age_range = (15, 31)
    dateNaissance = fake.date_of_birth(minimum_age=age_range[0], maximum_age=age_range[1]).strftime('%Y-%m-%d')
    return dateNaissance


def get_category(sexe, dateNaissance):
    birth_year = int(dateNaissance.split('-')[0])

    # Catégorie des gymnastes selon leur âge (pas une représentation exacte de la réalité)
    if birth_year >= 2016:
        return '1'
    elif 2015 >= birth_year >= 2014:
        return '2'
    elif 2013 >= birth_year >= 2012:
        return '3'
    elif 2011 >= birth_year >= 2010:
        return '4'
    elif 2009 >= birth_year >= 2008:
        return '5'
    elif 2007 >= birth_year >= 2005:
        return '6'
    elif 2004 >= birth_year >= 2002 and sexe == 'F':
        return '7'
    elif 2001 >= birth_year and sexe == 'F':
        return random.choice(['7', 'D'])  # à 22 ans les femmes peuvent choisir C7 ou CD
    elif 2004 >= birth_year >= 1996 and sexe == 'M':
        return '7'
    elif 1995 >= birth_year and sexe == 'M':
        return random.choice(['7', 'H'])  # à 28 ans les hommes peuvent choisir C7 ou CH
    else:
        return 'Unknown'


def save_to_csv(gymnastes, filename='gymnastes.csv'):
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['noFSG', 'nom', 'prenom', 'sexe', 'dateNaissance', 'categorie', 'idSociete']
        writer = csv.writer(csvfile)
        writer.writerow(fieldnames)
        writer.writerows(gymnastes)


if __name__ == "__main__":
    # Beaucoup plus de gymnastes filles que garçons
    m_gymnastes = generate_gymnastes('M', 50)
    f_gymnastes = generate_gymnastes('F', 250)

    save_to_csv(m_gymnastes + f_gymnastes)
