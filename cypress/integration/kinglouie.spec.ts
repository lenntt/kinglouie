/// <reference types="cypress" />

import { Trace, Input, ModelBuilder } from '../../src/model'

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

// const BASE_URL = 'https://example.cypress.io/todo'
const BASE_URL = 'https://qxperts.io/'

const MAXTRACES = 5
const MAXSTEPS = 15

describe('example to-do app', () => {
  it('clicks and checks responses', () => {
    const step = (trace) => {
      const clickableSelector = 'a:not([href*="mailto:"]):visible,button:visible,.button:visible,[role="button"]:visible,[role="link"]:visible,[role="menuitem"]:visible'

      Cypress.on('uncaught:exception', (err) => {
        trace.fail(`Uncaught Error: ${err}`)
      })

      const violationHandler = (violations:Array<any>) => {
        violations.forEach((violation) => {
          if(violation.impact === 'critical' || violation.impact === 'serious') {
            trace.fail([`a11y ${violation.impact} ${violation.nodes.length}x ${violation.description}`])
          }
        })
      };

      const labelFor = ($element) => {
        return Cypress.SelectorPlayground.getSelector($element)
      }

      return new Cypress.Promise((resolve) => {
        // observe
        cy.url().then(($url) => {
          trace.observe({url: $url}, [])

          cy.injectAxe();
          cy.checkA11y(null, null, violationHandler, true)

          // get random clickable and click
          cy.get(clickableSelector).then(($elements) => {
            const elementCount = $elements.length
            trace.observe({clickableElements: elementCount}, [])
            const selected = Cypress._.random(elementCount - 1);

            cy.get(clickableSelector).eq(selected).then(($element) => {
              trace.do(new Input(`click ${labelFor($element)}`))

              cy.get(clickableSelector).eq(selected).click({force:true})

              // log log
              console.log(`TRACE LENGTH: ${trace.size}`)
              const states = trace.model.states.map((state) => {return state.name + '- ' + state.meta.url + ' - ' + `${state.meta.clickableElements} clickable elements` + ' - errors:\n\t\t' + state.errors.join('\n\t\t')})
              console.log(`STATES: \n\t${states.join('\n\t')}`)
              const inputs = trace.model.inputs.map((input) => {return `'${input.name}'`})
              console.log(`inputs: \n\t${inputs.join('\n\t')}`)

              resolve()
            })
          })
        })
      })
    }

    const traces = []
    for (let traceCount = 0; traceCount < MAXTRACES; traceCount++ ) {
      const trace = new Trace()
      // go to known (initial) state
      cy.clearCookies()
      cy.visit(BASE_URL)
      cy.get('#hs-eu-confirmation-button').click()
      for (let steps = 0; steps < MAXSTEPS; steps++) {
        step(trace)
      }
      traces.push(trace)
    }
    cy.then(() => {
      const model = ModelBuilder.fromTraces(traces)
      console.log(model.toDot())
    })
  })
})
