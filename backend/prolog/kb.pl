% Single load point for the KB
:- [core, facts, rules].

% Each feature owns its own rules.pl (docs/02 §3) — load them here so the
% whole reasoning layer is actually live when the server starts, not just
% sitting on disk unused.
:- [features/guess_game/rules].
:- [features/neighbor_game/rules].
:- [features/capital_match/rules].
:- [features/explain_mode/rules].
:- [features/journey_mode/rules].

% Per-child, dynamic state (student_score/2 etc.) lives in its own feature
% folder rather than a shared root session.pl — see docs/01 §4.7.
:- [features/dashboard/session].
