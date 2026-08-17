% backend/prolog/features/explore_map/routes.pl
% HTTP route for Feature 1 — Interactive Map Learning.

:- http_handler(root(country/Name), handle_country(Name), []).

% GET /country/:name
handle_country(NameAtom, _Request) :-
    atom_string(NameAtom, NameStr),
    atom_string(Country, NameStr),
    ( country_info(Country, card(Country, Capital, Currency, Flag, Region, IsMember, Facts)) ->
        reply_json_dict(_{ country: Country, capital: Capital, currency: Currency,
                            flag: Flag, region: Region, asean_member: IsMember,
                            famous_for: Facts })
    ; reply_json_dict(_{ error: "country not found" }, [status(404)])
    ).
