% backend/prolog/kb.pl
% Single load point for the knowledge base: shared data + reasoning first,
% then every feature's rules.pl. server.pl loads this, then each feature's
% routes.pl on top (see docs/02-asean-explorer-architecture.md §3).

:- [facts].
:- [core].

:- ['features/explore_map/rules'].
:- ['features/journey_mode/rules'].
:- ['features/guess_game/rules'].
:- ['features/neighbor_game/rules'].
:- ['features/capital_match/rules'].
:- ['features/explain_mode/rules'].
:- ['features/dashboard/session'].
