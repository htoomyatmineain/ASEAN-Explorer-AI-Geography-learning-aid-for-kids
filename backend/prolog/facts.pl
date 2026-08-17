% backend/prolog/facts.pl
% Shared static data — §3 of docs/01-asean-explorer-prolog-kb.md
% Owned by Person 1 (Core & Integration Lead, docs/03). No feature folder should
% duplicate this data; query it via core.pl or a feature's rules.pl instead.

% --- §3.1 Countries & ASEAN membership ---------------------------------

country(brunei).
country(cambodia).
country(indonesia).
country(laos).
country(malaysia).
country(myanmar).
country(philippines).
country(singapore).
country(thailand).
country(vietnam).

% Non-ASEAN countries needed only so border/neighbor reasoning is complete
country(china).
country(india).
country(bangladesh).
country(papua_new_guinea).
country(timor_leste).

member_of(brunei,      asean).
member_of(cambodia,    asean).
member_of(indonesia,   asean).
member_of(laos,        asean).
member_of(malaysia,    asean).
member_of(myanmar,     asean).
member_of(philippines, asean).
member_of(singapore,   asean).
member_of(thailand,    asean).
member_of(vietnam,     asean).

asean_founded(1967).
asean_motto('One Vision, One Identity, One Community').

% --- §3.2 Capitals -------------------------------------------------------

capital(brunei,      bandar_seri_begawan).
capital(cambodia,    phnom_penh).
capital(indonesia,   jakarta).
capital(laos,        vientiane).
capital(malaysia,    kuala_lumpur).
capital(myanmar,     naypyidaw).
capital(philippines, manila).
capital(singapore,   singapore_city).
capital(thailand,    bangkok).
capital(vietnam,     hanoi).

% --- §3.3 Currencies -----------------------------------------------------

currency(brunei,      brunei_dollar).
currency(cambodia,    riel).
currency(indonesia,   rupiah).
currency(laos,        kip).
currency(malaysia,    ringgit).
currency(myanmar,     kyat).
currency(philippines, philippine_peso).
currency(singapore,   singapore_dollar).
currency(thailand,    baht).
currency(vietnam,     dong).

% --- §3.4 Languages --------------------------------------------------------

language(brunei,      malay).
language(cambodia,    khmer).
language(indonesia,   indonesian).
language(laos,        lao).
language(malaysia,    malay).
language(myanmar,     burmese).
language(philippines, filipino).
language(philippines, english).
language(singapore,   english).
language(singapore,   malay).
language(singapore,   mandarin).
language(singapore,   tamil).
language(thailand,    thai).
language(vietnam,     vietnamese).

% --- §3.5 Flags ------------------------------------------------------------

flag_emoji(brunei,      '🇧🇳').
flag_emoji(cambodia,    '🇰🇭').
flag_emoji(indonesia,   '🇮🇩').
flag_emoji(laos,        '🇱🇦').
flag_emoji(malaysia,    '🇲🇾').
flag_emoji(myanmar,     '🇲🇲').
flag_emoji(philippines, '🇵🇭').
flag_emoji(singapore,   '🇸🇬').
flag_emoji(thailand,    '🇹🇭').
flag_emoji(vietnam,     '🇻🇳').

flag_colors(brunei,      [yellow, white, black, red]).
flag_colors(cambodia,    [blue, red, white]).
flag_colors(indonesia,   [red, white]).
flag_colors(laos,        [red, blue, white]).
flag_colors(malaysia,    [red, white, blue, yellow]).
flag_colors(myanmar,     [yellow, green, red, white]).
flag_colors(philippines, [blue, red, white, yellow]).
flag_colors(singapore,   [red, white]).
flag_colors(thailand,    [red, white, blue]).
flag_colors(vietnam,     [red, yellow]).

% --- §3.6 Map coordinates ---------------------------------------------------

coordinates(brunei,       4.9031, 114.9398).
coordinates(cambodia,    11.5564, 104.9282).
coordinates(indonesia,   -6.2088, 106.8456).
coordinates(laos,        17.9757, 102.6331).
coordinates(malaysia,     3.1390, 101.6869).
coordinates(myanmar,     19.7633,  96.0785).
coordinates(philippines, 14.5995, 120.9842).
coordinates(singapore,    1.3521, 103.8198).
coordinates(thailand,    13.7563, 100.5018).
coordinates(vietnam,     21.0285, 105.8542).

% --- §3.7 Subregion (mainland vs. maritime Southeast Asia) -----------------

subregion(myanmar,     mainland).
subregion(thailand,    mainland).
subregion(laos,        mainland).
subregion(cambodia,    mainland).
subregion(vietnam,     mainland).

subregion(brunei,      maritime).
subregion(indonesia,   maritime).
subregion(malaysia,    maritime).
subregion(philippines, maritime).
subregion(singapore,   maritime).

% --- §3.8 Famous landmarks / animals / highlights ---------------------------

famous_for(brunei,      sultan_omar_ali_saifuddien_mosque).
famous_for(brunei,      kampong_ayer).

famous_for(cambodia,    angkor_wat).
famous_for(cambodia,    tonle_sap_lake).

famous_for(indonesia,   borobudur_temple).
famous_for(indonesia,   komodo_dragons).
famous_for(indonesia,   bali_beaches).

famous_for(laos,        luang_prabang_temples).
famous_for(laos,        mekong_river).

famous_for(malaysia,    petronas_towers).
famous_for(malaysia,    orangutans).

famous_for(myanmar,     elephants).
famous_for(myanmar,     shwedagon_pagoda).
famous_for(myanmar,     bagan_temples).

famous_for(philippines, chocolate_hills).
famous_for(philippines, palawan_islands).

famous_for(singapore,   merlion).
famous_for(singapore,   marina_bay_sands).
famous_for(singapore,   gardens_by_the_bay).

famous_for(thailand,    elephants).
famous_for(thailand,    grand_palace).

famous_for(vietnam,     ha_long_bay).
famous_for(vietnam,     hoi_an_lanterns).

% --- §3.9 Borders (each real-world border stated once — see core.pl neighbor/2)

% Mainland Southeast Asia
borders(myanmar,  thailand).
borders(myanmar,  laos).
borders(myanmar,  china).          % non-ASEAN
borders(myanmar,  india).          % non-ASEAN
borders(myanmar,  bangladesh).     % non-ASEAN
borders(thailand, laos).
borders(thailand, cambodia).
borders(thailand, malaysia).
borders(laos,     cambodia).
borders(laos,     vietnam).
borders(laos,     china).          % non-ASEAN
borders(cambodia, vietnam).
borders(vietnam,  china).          % non-ASEAN

% Maritime Southeast Asia
borders(malaysia,  indonesia).
borders(malaysia,  brunei).
borders(malaysia,  singapore).        % Johor–Singapore Causeway, not a natural land border
borders(indonesia, papua_new_guinea). % non-ASEAN
borders(indonesia, timor_leste).      % non-ASEAN

% --- §3.10 Special facts -----------------------------------------------------

landlocked(laos).               % Laos is the only landlocked ASEAN country
no_land_neighbors(philippines). % An archipelago — no land borders at all
no_land_neighbors(singapore).   % Island city-state; the causeway to Malaysia is a bridge, not a natural border
