#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

typedef struct player {
    int vida;
    unsigned int moedas;
} Player;

typedef struct Enemy {
    int vida;
} Enemy;

int dungeon(Player *p) {
    int resp;
    unsigned int premio;
    Enemy e = {10};

    printf("\nEntrando na dungeon.");
    fflush(stdout);
    sleep(3);

    printf("\nExplorando ");
    fflush(stdout);

    for (int i = 0; i < 3; i++) {
        sleep(1);
        printf(". ");
        fflush(stdout);
    }

    srand(time(NULL));
    printf("\n\nUma sombra apareceu!\nSua vida: %d\nVida dela: %d\n", p->vida, e.vida);
    while (e.vida > 0 && p->vida > 0) {
        printf("\n1: Atacar\n2: Pernona (HAWK)\n3: Fugir\nResposta: ");
        scanf(" %d", &resp);
        switch (resp) {
        case 1:
            e.vida -= 1;
            break;
        case 2:
            e.vida -= 5;
            break;
        default:
        }

        p->vida -= (rand() % 11) + 1;

        printf("\nSua vida: %d\nVida dela: %d\n", p->vida, e.vida);
    }

    if (p->vida > 0) {
        premio = (rand() % 5) + 1;
        printf("\nSombra derrotada! Você recebeu %u moeda(s).\nSaindo da dungeon.\n", premio);
        p->moedas += premio;
        return 0;
    } else {
        printf("\nGAME OVER!\n");
        return 1;
    }
}

void loja(Player *p) {
    char flag[28];
    int resp;
    FILE *f;

    printf("\n=========== LOJA ===========\n");
    printf("\nMoeda(s): %u", p->moedas);
    printf("\n1: Vida (10)\n2: Flag (999999)\nResposta: ");
    scanf(" %d", &resp);

    if (resp == 1) {
        p->vida += (rand() % 10) + 1;
        p->moedas -= 10;
    } else if (resp == 2 && p->moedas >= 999999) {
        printf("\nCaramba! Quantas sombras você derrotou!?");

        f = fopen("flag.txt", "r");
        fgets(flag, 28, f);
        fclose(f);

        printf("\nAqui está sua flag: %s\n", flag);
        p->moedas -= 999999;
    }
}

int main() {
    int resp;
    int derrota = 0;
    Player p = {100, 0};

    do {
        printf("\n=========== PERSONA 6 ===========\n");
        printf("\n1: Dungeon\n2: Loja\n3: Sair\nResposta: ");
        scanf(" %d", &resp);

        switch (resp) {
        case 1:
            derrota = dungeon(&p);
            break;
        case 2:
            loja(&p);
            break;
        default:
        }

    } while (resp != 3 && !derrota);
    return 0;
}