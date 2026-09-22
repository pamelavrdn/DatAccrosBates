import '@testing-library/jest-dom';
import { generateRandomPassword } from "../components/formulaire/PasswordGenerator";

describe('generateRandomPassword function', () => {
    it('devrait générer un mot de passe aléatoire de la longueur spécifiée', () => {
        const length = 8;
        const password = generateRandomPassword(length);
        // Vérifiez que la longueur du mot de passe généré est correcte
        expect(password).toHaveLength(length);
    });
});
