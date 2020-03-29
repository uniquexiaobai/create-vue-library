import HelloWorld from './components/HelloWorld';

function install(Vue) {
	Vue.component('hello-world', HelloWorld);
}

export { HelloWorld };

export default { HelloWorld, install };
