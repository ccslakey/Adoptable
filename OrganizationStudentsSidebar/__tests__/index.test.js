import React from 'react';
import renderer from 'react-test-renderer';
import OrganizationStudentsSidebar from '../index';

describe('<OrganizationStudentsSidebar />', () => {
  it('renders the content', () => {
    const props = {
      organization: {
        name: 'Foo',
        slug: 'foo',
        sections: {
          edges: [
            {
              node: {
                id: 'testId',
                name: 'testSection',
                users: {
                  edges: [
                    {
                      node: {
                        id: 'userId',
                        email: 'test@test.com',
                        full_name: 'demoAccount',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      sections: [],
    };
    const component = renderer.create(
      <OrganizationStudentsSidebar {...props} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
