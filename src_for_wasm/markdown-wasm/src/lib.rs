use wasm_bindgen::prelude::*;

use comrak::{markdown_to_html, ComrakOptions};

/// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn render_markdown(src: &str) -> String {
    markdown_to_html(src, &ComrakOptions::default())
}

#[cfg(test)]
mod test {
    use super::render_markdown;

    #[test]
    fn basics() {
        let html = render_markdown("### markdown-wasm
- Just a wrapper of [comrak](https://crates.io/crates/comrak).
- Use `dangerouslySetInnerHTML` in your React app.
- **Hope you like it**");
        assert_eq!(&html, "<h3>markdown-wasm</h3>
<ul>
<li>Just a wrapper of <a href=\"https://crates.io/crates/comrak\">comrak</a>.</li>
<li>Use <code>dangerouslySetInnerHTML</code> in your React app.</li>
<li><strong>Hope you like it</strong></li>
</ul>
");
    }
}
