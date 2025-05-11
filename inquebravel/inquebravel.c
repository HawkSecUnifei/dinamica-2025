#include <stdio.h>

int check(char *string) {
    int vet[20] = {0x0, 0x29, 0x3f, 0x23, 0x33, 0xa, 0x3d, 0x2e, 0x2e, 0x2d, 0x3a, 0x7, 0x3e, 0x2d, 0x3a, 0x2e, 0x24, 0x27, 0x3f, 0x35};
    for (int i = 0; i < 20; i++) {
        if ((int)string[i] != (vet[i] ^ 0x48)) {
            return 0;
        }
    }
    return 1;
}

int main() {
    FILE *f;
    char flag[39];
    char permissao[21];
    char nome[12];

    printf("\nDigite seu nome: ");
    fgets(nome, 33, stdin);

    if (check(permissao)) {
        printf("\nPermissão verificada, aqui está a flag!");

        f = fopen("flag.txt", "r");
        fgets(flag, 39, f);
        fclose(f);

        printf("\n%s\n", flag);
    } else {
        printf("\nVocê não tem permissão para ver a flag.\n");
    }

    return 0;
}