from unittest.mock import Mock

from src.discovery import discover

def test_discover_extracts_public_page_metadata():
    client = Mock()
    result = Mock(
        error=None,
        status_code=200,
        final_url="https://example.com/",
        body="""
        <html>
          <head><title>Example</title></head>
          <body>
            <a href="/cars">Cars</a>
            <script src="/static/app.js"></script>
            <form action="/search" method="post"></form>
          </body>
        </html>
        """,
    )
    client.get.return_value = result

    page = discover("https://example.com/", client)

    assert page.status_code == 200
    assert page.title == "Example"
    assert "https://example.com/cars" in page.links
    assert "https://example.com/static/app.js" in page.scripts
    assert page.forms == [{"action": "https://example.com/search", "method": "POST"}]
