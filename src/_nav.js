export default {
  items: [
    {
      title: true,
      name: 'Social network',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'My profile',
      url: '/profile',
      icon: 'icon-drop',
    },
    {
      name: 'Find friends',
      url: '/users',
      icon: 'icon-drop',
    },
    {
      name: 'Write blog',
      url: '/create-blog',
      icon: 'icon-drop',
    },
    {
      name: 'Chat with friends',
      url: '/users',
      icon: 'icon-drop',
    },
  ],
};
