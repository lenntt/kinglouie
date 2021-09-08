DONOTMERGE
New branch, a reimplementation, with Cypress.

To learn and evaluate *cypress*.

Benefits:
- code executes in same enviroment as kinglouie, easier to debug
- replay, video recording for free
- picking a random element and then getting its `Cypress.SelectorPlayground.getSelector` is pretty cool
- I could probably wrap this into a cypress plugin, so its easier for users to pick up.

Drawbacks:
- It's a test framework, not an automation framework
    - I have to hack my way into  KingLouie is a test case
    - I need some lower level things, that forces me to deviate from that sample-type syntax (indents, make my own promise chain)
- I'd hoped it would be faster (a11y injection may slows things down? - TODO: optimize?)
