import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import ConnectedStudentList, {
  StudentList,
  Header,
  ListWindowContent,
  Toolbar,
  NameFilterForm,
  AddStudentButton,
  SettingsButton,
  ListTable,
  ListTableHead,
  ListTableHeadRow,
  Th,
  ListTableBody
} from '../../src/components/StudentList'

// const SUBCOMPONENTS = Object.keys(components)
//
// function markAsTested(component) {
//   SUBCOMPONENTS.splice(SUBCOMPONENTS.indexOf(component), 1)
// }
//
// after(() => {
//   console.log("UNTESTED COMPONENTS (StudentList)", SUBCOMPONENTS)
// })

function setup (Component, props={}) {

  let renderer = TestUtils.createRenderer()
  renderer.render(<Component {...props} />)
  let output = renderer.getRenderOutput()

  return { props, output, renderer }
}

describe('components', () => {

  describe('StudentList', () => {
    it('should render correctly', () => {
      const { output } = setup(StudentList, {
        studentList: { loading: false }
      })

      expect(output.type).toBe('div')
      expect(output.props.className).toBe('window')

      let [ _Header, _WindowContent, _Footer ] = output.props.children

      expect(_Header.type).toBe(Header)
      expect(_WindowContent.type).toBe(ListWindowContent)
    })
  })

  describe('Header', () => {
    it('should render properly', () => {
      const { output } = setup(Header)

      expect(output.type).toBe('header')
      expect(output.props.className).toBe('toolbar toolbar-header')

      let _Toolbar = output.props.children

      expect(_Toolbar.type).toBe(Toolbar)
    })
  })

  describe('Toolbar', () => {
    it('should render correctly', () => {
      const { output } = setup(Toolbar)

      expect(output.type).toBe('div')
      expect(output.props.className).toBe('toolbar-actions')

      let [ _NameFilterForm, _AddStudentButton, _SettingsButton ] = output.props.children

      expect(_NameFilterForm.type).toBe(NameFilterForm)
      expect(_AddStudentButton.type).toBe(AddStudentButton)
      expect(_SettingsButton.type).toBe(SettingsButton)
    })
  })

  describe('NameFilterForm', () => {
    it('should render correctly', () => {
      const { output } = setup(NameFilterForm)

      expect(output.type).toBe('form')

      let input = output.props.children

      expect(input.type).toBe('input')
      expect(input.props.placeholder).toBe('Filter by Name')
    })

    it('should call filterByName on change', () => {
      const { output, props } = setup(NameFilterForm, {
        filterByName: expect.createSpy(),
        nameFilter: "d"
      })

      let input = output.props.children

      expect(input.props.value).toBe('d')
      input.props.onChange({target: {value: 'da'} })
      expect(props.filterByName.calls.length).toBe(1)
      expect(props.filterByName).toHaveBeenCalledWith('da')
    })
  })

  describe('AddStudentButton', () => {
    it('should render correctly', () => {
      const { output } = setup(AddStudentButton)

      expect(output.type).toBe('button')

      let [_span, text] = output.props.children

      expect(_span.type).toBe('span')
      expect(_span.props.className).toBe('icon icon-user-add icon-text')
      expect(text).toBe('Add')
    })

    it('should call newStudent and push when clicked', () => {
      const { output, props } = setup(AddStudentButton, {
        newStudent: expect.createSpy(),
        push: expect.createSpy()
      })

      output.props.onClick()
      expect(props.newStudent.calls.length).toBe(1)
      expect(props.push.calls.length).toBe(1)
      expect(props.push).toHaveBeenCalledWith('/student/new')
    })
  })

  describe('SettingsButton', () => {
    it('should render correctly', () => {
      const { output } = setup(SettingsButton)

      expect(output.type).toBe('button')
      expect(output.props.className).toBe('btn btn-default pull-right')

      let _span = output.props.children

      expect(_span.type).toBe('span')
      expect(_span.props.className).toBe('icon icon-cog')
    })

    it('should call newStudent and push when clicked', () => {
      const { output, props } = setup(SettingsButton, {
        push: expect.createSpy()
      })

      output.props.onClick()
      expect(props.push.calls.length).toBe(1)
      expect(props.push).toHaveBeenCalledWith('/settings')
    })
  })

  describe('ListTable', () => {
    it('should render correctly', () => {
      const { output } = setup(ListTable)

      expect(output.type).toBe('table')
      expect(output.props.className).toBe('table-striped')

      let [_ListTableHead, _ListTableBody] = output.props.children

      expect(_ListTableHead.type).toBe(ListTableHead)
      expect(_ListTableBody.type).toBe(ListTableBody)
    })
  })

  describe('ListTableHead', () => {
    it('should render correctly', () => {
      const { output } = setup(ListTableHead)

      expect(output.type).toBe('thead')

      let _ListTableHeadRow = output.props.children

      expect(_ListTableHeadRow.type).toBe(ListTableHeadRow)
    })
  })

  describe('ListTableHeadRow', () => {
    it('should render several Th', () => {
      const { output, props } = setup(ListTableHeadRow, {
        studentList: { sortBy: 'last_jump_date', sortDesc: true },
        toggleSort: expect.createSpy()
      })

      expect(output.type).toBe('tr')

      let [ name, email, phone, last_jump, last_jump_date ] = output.props.children

      expect(name.type).toBe(Th)
      expect(name.props.sortField).toBe('name')
      name.props.onClick()
      expect(props.toggleSort.calls.length).toBe(1)
      expect(props.toggleSort).toHaveBeenCalledWith('name')
    })
  })

  describe('Th', () => {
    it('should render a th with the name as child', () => {
      const { output, props } = setup(Th, {name: 'Email'})

      expect(output.type).toBe('th')

      let [ text, span ] = output.props.children

      expect(text).toBe('Email')
    })

    it('should render a span if sortField prop is set', () => {
      const { output, props } = setup(Th, {
        name: 'Last Jump',
        onClick: expect.createSpy(),
        sortField: 'last_jump_date',
        sortBy: 'last_jump_date',
        sortDesc: true
      })

      expect(output.type).toBe('th')

      output.props.onClick()

      expect(output.props.onClick.calls.length).toBe(1)

      let [ text, span ] = output.props.children

      expect(text).toBe('Last Jump')
      expect(span.type).toBe('span')
      expect(span.props.className).toBe('icon pull-right icon-down-dir')
    })
  })
})
