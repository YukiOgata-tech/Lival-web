import json

# Supabaseから取得したresponse_payloadを模擬
response_payload = {
    "text": "置換積分（u置換）\n  - 形が \\(\\displaystyle f(g(x))\\,g'(x)\\) のとき、\\(u=g(x)\\) とおくと\n    \\[\n    \\int f(g(x))\\,g'(x)\\,dx=\\int f(u)\\,du\n    \\]\n\n-"
}

text = response_payload.get("text", "")

print("=== Original text ===")
print(repr(text))
print()

# チャンク分割シミュレーション
chunk_size = 15
chunks = []
for i in range(0, len(text), chunk_size):
    chunk = text[i:i + chunk_size]
    chunks.append(chunk)

print("=== First 5 chunks ===")
for idx, chunk in enumerate(chunks[:5]):
    content_event = {"type": "content", "text": chunk}
    sse_line = f"data: {json.dumps(content_event, ensure_ascii=False)}\n\n"
    print(f"Chunk {idx}: {repr(sse_line)}")

print()

# done イベント
done_event = {"type": "done", "full_text": text}
sse_done = f"data: {json.dumps(done_event, ensure_ascii=False)}\n\n"
print("=== Done event (first 200 chars) ===")
print(repr(sse_done[:200]))
