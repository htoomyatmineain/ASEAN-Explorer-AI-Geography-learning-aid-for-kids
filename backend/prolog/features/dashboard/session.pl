% backend/prolog/features/dashboard/session.pl
% Feature 7 — Personal Progress (§4.7 of docs/01-asean-explorer-prolog-kb.md)
% Owned by Person 5 (docs/03).
%
% Unlike facts.pl, student_score/2 is per-child and changes constantly, so it's
% declared dynamic and updated with assertz/retractall instead of being written
% by hand. See docs/02-asean-explorer-architecture.md §2.5 for how this is meant
% to be backed by backend/db/scores.sqlite across sessions.

:- dynamic student_score/2.

% Each topic maps to the mini-game that best practices it
activity_for(countries_and_capitals,  match_the_capitals_game).
activity_for(neighboring_countries,   who_is_my_neighbor_game).
activity_for(asean_membership,        explore_asean_game).
activity_for(flags_and_currencies,    guess_the_country_game).

% set_score(+Topic, +Score) — call after each quiz round to update the profile
set_score(Topic, Score) :-
    retractall(student_score(Topic, _)),
    assertz(student_score(Topic, Score)).

% weakest_topic(-Topic) — the topic with the lowest recorded score
weakest_topic(Topic) :-
    findall(Score-T, student_score(T, Score), Pairs),
    sort(Pairs, [_-Topic|_]).   % sort/2 orders by Score first (standard order of terms)

% recommend_activity(-Activity) — what the child should try next
recommend_activity(Activity) :-
    weakest_topic(Topic),
    activity_for(Topic, Activity).

% needs_practice(-Topic) — any topic scoring below 60%
needs_practice(Topic) :-
    student_score(Topic, Score),
    Score < 60.
