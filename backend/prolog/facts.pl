country(myanmar).
country(thailand).
country(laos).
country(vietnam).
country(cambodia).
country(malaysia).
country(singapore).
country(indonesia).
country(philippines).
country(brunei).

capital(myanmar, naypyidaw).
capital(thailand, bangkok).
capital(laos, vientiane).
capital(vietnam, hanoi).
capital(cambodia, phnom_penh).
capital(malaysia, kuala_lumpur).
capital(singapore, singapore).
capital(indonesia, jakarta).
capital(philippines, manila).
capital(brunei, bandar_seri_begawan).

borders(myanmar, thailand).
borders(myanmar, laos).
borders(myanmar, china).
borders(myanmar, india).
borders(myanmar, bangladesh).
borders(thailand, myanmar).
borders(thailand, laos).
borders(thailand, cambodia).
borders(thailand, malaysia).
borders(laos, myanmar).
borders(laos, thailand).
borders(laos, cambodia).
borders(laos, vietnam).
borders(laos, china).
borders(vietnam, laos).
borders(vietnam, cambodia).
borders(vietnam, china).
borders(cambodia, thailand).
borders(cambodia, laos).
borders(cambodia, vietnam).
borders(malaysia, thailand).
borders(malaysia, indonesia).
borders(malaysia, brunei).
borders(indonesia, malaysia).
borders(indonesia, philippines).
borders(indonesia, brunei).
borders(philippines, indonesia).
borders(brunei, malaysia).
borders(brunei, indonesia).

neighbor(A, B) :- borders(A, B).
neighbor(A, B) :- borders(B, A).
