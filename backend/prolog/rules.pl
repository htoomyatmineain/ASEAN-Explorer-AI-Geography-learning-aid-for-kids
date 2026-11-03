% ============================================================
% Interactive Map Learning (§4.2 of docs/01-asean-explorer-prolog-kb.md)
% ============================================================

% country_info(+Country, -Card) builds the full pop-up card shown when a
% child taps a country on the interactive map.
country_info(Country, card(Country, Capital, Currency, FlagEmoji, Region, IsMember, MemberSince, Facts, Animals, Foods)) :-
    capital(Country, Capital),
    currency(Country, Currency),
    flag_emoji(Country, FlagEmoji),
    subregion(Country, Region),
    ( asean_country(Country) -> IsMember = yes ; IsMember = no ),
    ( asean_member_since(Country, Year) -> MemberSince = Year ; MemberSince = null ),
    findall(F, famous_for(Country, F), Facts),
    findall(A, national_animal(Country, A), Animals),
    findall(Fd, famous_food(Country, Fd), Foods).

% find_non_neighbors/3 and check_capital_match/3 used to be duplicated here
% and in their own feature files. The feature files (loaded via kb.pl) are
% now the single source of truth — see backend/prolog/features/neighbor_game/
% rules.pl and backend/prolog/features/capital_match/rules.pl.