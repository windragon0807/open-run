#!/usr/bin/env python3
"""
Frontend /api/chat smoke test.

Validates end-to-end lane/action/uiHints behavior through the Next.js BFF route.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Case:
    name: str
    message: str
    expected_lane: str | tuple[str, ...]
    expected_kind: str | tuple[str, ...] | None = None
    expected_action: str | None | tuple[str | None, ...] = None
    expected_reply_contains: str | tuple[str, ...] | None = None
    expect_show_sources: bool | None = None
    expect_show_action_buttons: bool | None = None
    history: list[dict[str, str]] = field(default_factory=list)
    conversation_state: dict[str, Any] | None = None


def _as_tuple(value: Any) -> tuple[Any, ...]:
    if isinstance(value, tuple):
        return value
    return (value,)


def _post_json(url: str, payload: dict[str, Any], timeout: float, cookie_header: str | None) -> dict[str, Any]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers: dict[str, str] = {"Content-Type": "application/json"}
    if cookie_header:
        headers["Cookie"] = cookie_header

    req = urllib.request.Request(
        url,
        data=body,
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _evaluate_case(endpoint: str, case: Case, timeout: float, cookie_header: str | None) -> tuple[bool, str]:
    payload = {
        "message": case.message,
        "history": case.history,
        "pendingAction": None,
        "conversationState": case.conversation_state,
    }
    data = _post_json(endpoint, payload, timeout=timeout, cookie_header=cookie_header)

    lane = data.get("lane")
    kind = data.get("kind")
    proposal = data.get("proposal") if isinstance(data.get("proposal"), dict) else {}
    action = proposal.get("actionKey")
    reply = str(data.get("reply", "") or "")
    ui_hints = data.get("uiHints") if isinstance(data.get("uiHints"), dict) else {}
    show_sources = ui_hints.get("showSources")
    show_action_buttons = ui_hints.get("showActionButtons")

    checks: list[str] = []
    ok = True

    if lane not in _as_tuple(case.expected_lane):
        ok = False
        checks.append(f"lane expected={_as_tuple(case.expected_lane)} actual={lane}")

    if case.expected_kind is not None and kind not in _as_tuple(case.expected_kind):
        ok = False
        checks.append(f"kind expected={_as_tuple(case.expected_kind)} actual={kind}")

    if action not in _as_tuple(case.expected_action):
        ok = False
        checks.append(f"action expected={_as_tuple(case.expected_action)} actual={action}")

    if case.expected_reply_contains is not None:
        needles = _as_tuple(case.expected_reply_contains)
        if not any(isinstance(needle, str) and needle in reply for needle in needles):
            ok = False
            checks.append(f"reply missing any of {needles}")

    if case.expect_show_sources is not None and show_sources is not case.expect_show_sources:
        ok = False
        checks.append(f"showSources expected={case.expect_show_sources} actual={show_sources}")

    if case.expect_show_action_buttons is not None and show_action_buttons is not case.expect_show_action_buttons:
        ok = False
        checks.append(f"showActionButtons expected={case.expect_show_action_buttons} actual={show_action_buttons}")

    status = "PASS" if ok else "FAIL"
    detail = ", ".join(checks) if checks else f"kind={kind}, lane={lane}, action={action}"
    return ok, f"[{status}] {case.name}: {detail}"


def _default_cases() -> list[Case]:
    challenge_context = [{"role": "assistant", "content": "도전과제 페이지에서 보상 받기 탭을 안내했어요."}]
    return [
        Case(
            name="chat_smalltalk",
            message="내 말이 들려?",
            expected_lane="chat",
            expected_kind="chat",
            expected_action=None,
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
        Case(
            name="chat_general",
            message="네 이름이 뭐야?",
            expected_lane="chat",
            expected_kind="chat",
            expected_action=None,
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
        Case(
            name="qa_spec_question",
            message="도전과제가 뭐야?",
            expected_lane="qa",
            expected_kind="qa",
            expected_action=None,
            expect_show_sources=True,
            expect_show_action_buttons=False,
        ),
        Case(
            name="qa_reward_button_explain",
            message="보상받기를 누르면 뭘 얻게 돼?",
            history=challenge_context,
            expected_lane="qa",
            expected_kind="qa",
            expected_action=None,
            expect_show_sources=True,
            expect_show_action_buttons=False,
        ),
        Case(
            name="action_navigate_challenge",
            message="도전과제 페이지로 데려가줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="challenge.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_challenge_general",
            message="일반 도전과제 탭으로 이동해줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="challenge.general.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_challenge_completed",
            message="완료 도전과제 탭으로 이동해줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="challenge.completed.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_home",
            message="홈 화면으로 이동시켜줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="home.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_profile",
            message="프로필 페이지로 이동시켜줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="profile.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_profile_modify",
            message="프로필 정보 수정 페이지로 이동해줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="profile.modify.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_profile_notification",
            message="알림 설정 페이지로 이동해줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="profile.notification.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_navigate_bung_search",
            message="벙 검색 페이지로 이동해줘",
            expected_lane="action",
            expected_kind="action_navigate",
            expected_action="bung.search.open_page",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_execute_join_collect",
            message="이 벙 참여해줘",
            expected_lane="action",
            expected_kind="action_collect",
            expected_action="bung.join",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="action_invite_unavailable",
            message="유저 초대해줘",
            expected_lane="action",
            expected_kind="action_unavailable",
            expected_action="bung.invite_members",
            expect_show_sources=False,
            expect_show_action_buttons=True,
        ),
        Case(
            name="read_my_bung_count_unauth",
            message="지금 내가 참여하고 있는 벙이 몇 개야?",
            expected_lane="read",
            expected_kind="qa",
            expected_action=None,
            expected_reply_contains="로그인이 필요해요",
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
        Case(
            name="read_claimable_unauth",
            message="보상 받기 가능한 과제 있니?",
            expected_lane="read",
            expected_kind="qa",
            expected_action=None,
            expected_reply_contains="로그인이 필요해요",
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
        Case(
            name="read_named_challenge_status_unauth",
            message="중에서 '프로필 완성하기' 도전과제를 완료할 수 있는 상태야?",
            expected_lane="read",
            expected_kind="qa",
            expected_action=None,
            expected_reply_contains="로그인이 필요해요",
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
        Case(
            name="read_weather_collect",
            message="오늘 기온 어때?",
            expected_lane="read",
            expected_kind="qa",
            expected_action=None,
            expected_reply_contains=("어느 지역", "지역 날씨를 확인"),
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
        Case(
            name="privacy_block_other_user",
            message="민수님 이메일 알려줘",
            expected_lane="qa",
            expected_kind="qa",
            expected_action=None,
            expected_reply_contains=("개인정보 보호", "조회할 수 없습니다"),
            expect_show_sources=False,
            expect_show_action_buttons=False,
        ),
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Smoke test frontend /api/chat")
    parser.add_argument("--endpoint", default="http://localhost:3000/api/chat", help="frontend /api/chat endpoint URL")
    parser.add_argument("--timeout", type=float, default=30.0, help="HTTP timeout seconds")
    parser.add_argument("--rounds", type=int, default=1, help="repeat full suite N rounds")
    parser.add_argument("--cookie", default="", help="optional Cookie header (for authenticated checks)")
    args = parser.parse_args()

    cases = _default_cases()
    passed = 0
    failed = 0

    rounds = max(args.rounds, 1)
    for round_idx in range(rounds):
        if rounds > 1:
            print(f"\n== Round {round_idx + 1}/{rounds} ==")

        for case in cases:
            try:
                ok, line = _evaluate_case(args.endpoint, case, timeout=args.timeout, cookie_header=args.cookie or None)
            except urllib.error.HTTPError as exc:
                failed += 1
                print(f"[FAIL] {case.name}: HTTP {exc.code} {exc.reason}")
                continue
            except Exception as exc:  # noqa: BLE001
                failed += 1
                print(f"[FAIL] {case.name}: {exc}")
                continue

            if ok:
                passed += 1
            else:
                failed += 1
            print(line)

    total = passed + failed
    print(f"\nResult: {passed}/{total} passed, {failed} failed (rounds={rounds})")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
