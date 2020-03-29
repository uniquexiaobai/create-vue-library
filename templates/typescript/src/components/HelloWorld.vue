<template>
	<div>
		<h1>{{msg}}</h1>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export type NameType = string;

export default class Home extends Vue {
	msg: NameType = 'HelloWorld';
}
</script>

<style scoped>
h1 {
	font-weight: normal;
	text-align: center;
}
</style>>