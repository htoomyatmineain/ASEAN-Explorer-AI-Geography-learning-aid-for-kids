% backend/prolog/features/explore_map/rules.pl
% Feature 1 — Interactive Map Learning (§4.2 of docs/01-asean-explorer-prolog-kb.md)
% Owned by Person 2 (docs/03).

% country_info(+Country, -Card) builds the full pop-up card shown when a
% child taps a country on the interactive map.
country_info(Country, card(Country, Capital, Currency, FlagEmoji, Region, IsMember, Facts)) :-
    capital(Country, Capital),
    currency(Country, Currency),
    flag_emoji(Country, FlagEmoji),
    subregion(Country, Region),
    ( asean_country(Country) -> IsMember = yes ; IsMember = no ),
    findall(F, famous_for(Country, F), Facts).
