% backend/prolog/features/dashboard/routes.pl
% HTTP routes for Feature 7 — Personal Progress.

:- http_handler(root(score), handle_set_score, [method(post)]).
:- http_handler(root(recommend), handle_recommend, [method(get)]).
:- http_handler(root(scores), handle_all_scores, [method(get)]).

% POST /score
% Body: { "topic": "neighboring_countries", "score": 40 }
handle_set_score(Request) :-
    http_read_json_dict(Request, Body),
    atom_string(Topic, Body.get(topic)),
    Score = Body.get(score),
    set_score(Topic, Score),
    reply_json_dict(_{ topic: Topic, score: Score }).

% GET /recommend
handle_recommend(_Request) :-
    ( recommend_activity(Activity) ->
        weakest_topic(Topic),
        reply_json_dict(_{ weakest_topic: Topic, recommended_activity: Activity })
    ; reply_json_dict(_{ error: "no scores recorded yet" }, [status(404)])
    ).

% GET /scores — full topic-by-topic breakdown for the ScoreDashboard component
handle_all_scores(_Request) :-
    findall(_{ topic: Topic, score: Score }, student_score(Topic, Score), Scores),
    reply_json_dict(_{ scores: Scores }).
