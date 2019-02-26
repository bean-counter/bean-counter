import React from 'react'
import renderer from 'react-test-renderer'
// import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import store from '../../../store'
import ImportFromInstitutionForm from '../form'

// jest.mock('../formFields', () => 'InstitutionFormFields')
describe.skip('Account form', () => {
  const mochHandleSubmit = jest.fn()
  const mochHandleChange = jest.fn()
  const mochHandleCancel = jest.fn()
  const mochHandleDelete = jest.fn()
  const accountGroup = {
    id: 'g1',
    apiKey: 'abc',
    apiSecret: 'def',
    accountIds: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('matches snapshot for new account', () => {
    const component = renderer.create((
      <Provider store={store}>
        <ImportFromInstitutionForm
          institutions={[{ label: 'TD', value: 'TD' }]}
          handleSubmit={mochHandleSubmit}
          values={{}}
          errors={{}}
          touched={{}}
          isSubmitting={false}
          handleChange={mochHandleChange}
          handleCancel={mochHandleCancel}
          handleDelete={mochHandleDelete}
          classes={{ }}
          institution="TD"
          accountGroup={accountGroup}
        />
      </Provider>
    ))
    expect(component.toJSON()).toMatchSnapshot()
  })

  // it('matches snapshot for edit account', () => {
  //   const component = renderer.create((
  //     <AccountFormComponent
  //       institutions={[{ label: 'TD', value: 'TD' }]}
  //       account={{ id: 1 }}
  //       handleSubmit={mochHandleSubmit}
  //       values={{}}
  //       errors={{}}
  //       touched={{}}
  //       isSubmitting={false}
  //       handleChange={mochHandleChange}
  //       setFieldValue={mochSetFieldValue}
  //       handleDelete={mochHandleDelete}
  //       handleCancel={mochHandleCancel}
  //       classes={{ }}
  //     />
  //   ))
  //   expect(component.toJSON()).toMatchSnapshot()
  // })

  // describe('Component methods', () => {
  //   const wrapper = shallow((
  //     <AccountFormComponent
  //       institutions={[{ label: 'TD', value: 'TD' }]}
  //       account={{ id: 1 }}
  //       handleSubmit={mochHandleSubmit}
  //       values={{}}
  //       errors={{}}
  //       touched={{}}
  //       isSubmitting={false}
  //       handleChange={mochHandleChange}
  //       setFieldValue={mochSetFieldValue}
  //       handleDelete={mochHandleDelete}
  //       handleCancel={mochHandleCancel}
  //       classes={{ }}
  //     />
  //   ))
  //   const instance = wrapper.instance()

  //   it('should handleInstitutionChange', () => {
  //     instance.setState({ hideInstitutionOptions: true })
  //     expect(instance.state.hideInstitutionOptions).toBeTruthy()

  //     instance.handleInstitutionChange([
  //       'institution',
  //       { label: 'Bank of Montreal', value: 'BMO' }
  //     ])
  //     expect(mochSetFieldValue).toHaveBeenCalled()
  //     expect(instance.state.hideInstitutionOptions).toBeFalsy()
  //   })

  //   it('should handleCloseInstitutionOptions', () => {
  //     instance.setState({ hideInstitutionOptions: false })
  //     expect(instance.state.hideInstitutionOptions).toBeFalsy()

  //     instance.handleCloseInstitutionOptions()
  //     expect(instance.state.hideInstitutionOptions).toBeTruthy()
  //   })

  //   it('should display institutionOptions only if institution has API', () => {
  //     instance.setState({ hideInstitutionOptions: false })
  //     expect(instance.state.hideInstitutionOptions).toBeFalsy()

  //     expect(instance.institutionOptions()).toBeNull()

  //     expect(institutions.BMO.importTypes).not.toContain('API')
  //     expect(instance.institutionOptions({ value: 'BMO' })).toBeNull()

  //     expect(institutions.Coinbase.importTypes).toContain('API')
  //     expect(instance.institutionOptions({ value: 'Coinbase' })).not.toBeNull()
  //   })

  //   it('should never display institutionOptions if hideInstitutionOptions is true', () => {
  //     instance.setState({ hideInstitutionOptions: true })
  //     expect(instance.state.hideInstitutionOptions).toBeTruthy()

  //     expect(instance.institutionOptions()).toBeNull()

  //     expect(institutions.BMO.importTypes).not.toContain('API')
  //     expect(instance.institutionOptions({ value: 'BMO' })).toBeNull()

  //     expect(institutions.Coinbase.importTypes).toContain('API')
  //     expect(instance.institutionOptions({ value: 'Coinbase' })).toBeNull()
  //   })
  // })
})
