export const GET_USER_PROFILE = `
  query GetUserProfile {
    viewer {
      id
      databaseId
      firstName
      lastName
      description
      email
    }
  }
`;

export const GET_MENU = `
  query GetMenu {
    menuItems(where: { location: PRIMARY }, first: 100) {
      nodes {
        id
        label
        path
        parentId
        childItems {
          nodes {
            id
            label
            path
            childItems {
              nodes {
                id
                label
                path
              }
            }
          }
        }
      }
    }
  }
`;