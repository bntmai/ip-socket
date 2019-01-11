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
      url: '/home/profile',
      icon: 'icon-drop',
    },
    {
      name: 'Find friends',
      url: '/home/users',
      icon: 'icon-drop',
    },
    {
      name: 'Write blog',
      url: '/home/create-blog',
      icon: 'icon-drop',
    },
    {
      name: 'Chat with friends',
      url: '/home/chat',
      icon: 'icon-drop',
    },
  ],
};
