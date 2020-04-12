Vue.component('new-item-entrypoint', {
    props: [],
    data: function () {
        return {
            newItem: this.emptyNewItem(),
            beforeValidation: true
        }
    },
    methods: {
        submitNewItem: function () {
            this.beforeValidation = false;
            if (this.allValid) {
                this.$emit('new-item-entered', this.newItem);
                this.newItem = this.emptyNewItem();
                this.$refs.descriptionInput.focus();
                this.beforeValidation = true;
            }
        },
        emptyNewItem: function () {
            return {
                date: this.formattedDate(new Date()),
                amount: 0.0,
                description: ""
            }
        },
        formattedDate(date) {
            var year = "" + date.getFullYear();
            var month = date.getMonth() > 8 ? "" + (date.getMonth() + 1) : "0" + (1 + date.getMonth());
            var day = date.getDate() > 9 ? "" + date.getDate() : "0" + date.getDate();
            var result = year + "-" + month + "-" + day;
            console.log("Formatted date: '" + result + "'");
            return result;
        }
    },
    computed: {
        descriptionValid: function () {
            return this.beforeValidation || (this.newItem.description && 0 != this.newItem.description.length);
        },
        amountValid: function () {
            return this.beforeValidation || (this.newItem.amount && 0 < this.newItem.amount);
        },
        descriptionClass: function () {
            return {
                'is-invalid': !this.descriptionValid
            }
        },
        amountClass: function () {
            return {
                'is-invalid': !this.amountValid
            }
        },
        allValid: function () {
            return this.descriptionValid && this.amountValid;
        }
    },
    template: `
        <div class="container">
            <div class="input-group">
                        <input type="date" 
                            id="new-item-date" 
                            name="new-item-date"
                            min="2000-01-01" v-bind:max="new Date()"
                            v-model="newItem.date" />

                        <input class="form-control ml-3"
                            ref="descriptionInput"
                            v-bind:class="descriptionClass"
                            v-model="newItem.description" 
                            v-on:keyup.enter="submitNewItem"
                            placeholder="Enter new item" />

                        <div class="input-group-prepend ml-3">
                            <span class="input-group-text">PLN</span>
                        </div>
                        <input 
                            type="number"
                            class="form-control"
                            v-bind:class="amountClass"
                            v-model="newItem.amount"
                            placeholder="Enter amount"
                            v-on:keyup.enter="submitNewItem" />
            </div>
        </div>
    `
});

Vue.component('sort-indicator', {
    props: ["sortConfiguration", "attributeName"],
    computed: {
        sortOnMe: function () {
            return this.sortConfiguration.orderDefined && this.sortConfiguration.attributeName == this.attributeName;
        },
        displayBoth: function () {
            return !this.sortConfiguration.orderDefined;
        },
        displayUp: function () {
            return this.sortOnMe && this.sortConfiguration.order == 'asc';
        },
        displayDown: function () {
            return this.sortOnMe && this.sortConfiguration.order == 'desc';
        }
    },
    template: `
    <span>
        <svg v-if="displayBoth" class="bi bi-chevron-expand" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 01.708 0L8 12.793l3.646-3.647a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 010-.708zm0-2.292a.5.5 0 00.708 0L8 3.207l3.646 3.647a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0l-4 4a.5.5 0 000 .708z" clip-rule="evenodd"/>
        </svg>
        <svg v-if="displayUp" class="bi bi-chevron-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L8 5.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z" clip-rule="evenodd"/>
        </svg>
        <svg v-if="displayDown" class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"/>
        </svg>
    </span>
    `
});

Vue.component('spend-log-main', {
    props: [],
    methods: {
        newItemHandler: function (newItem) {
            newItem.id = this.seed;
            this.seed += 1;
            this.items.push(newItem);
        },
        itemRemovalHandler: function (itemId) {
            console.log('handling id: ', itemId)
            this.items = this.items.filter(item => !(item.id == itemId))
        },
        sortOn(attributeName) {
            this.sortConfiguration.orderDefined = true;
            if (this.sortConfiguration.attributeName == attributeName && this.sortConfiguration.order == 'asc') {
                this.sortConfiguration.order = 'desc';
            } else {
                this.sortConfiguration.order = 'asc';
            }
            this.sortConfiguration.attributeName = attributeName;
        }
    },
    data: function () {
        return {
            items: [
                { id: 1, description: "some stuff", amount: 65.3, date: "2010-01-31" },
                { id: 2, description: "other stuff", amount: 11, date: "2019-03-14" },
                { id: 3, description: "weird stuff", amount: 432412, date: "2020-02-03" }
            ],
            seed: 40,
            sortConfiguration: {
                orderDefined: false,
                attributeName: undefined,
                order: undefined
            }
        }
    },
    template: `
    <div class="container">
        <new-item-entrypoint @new-item-entered="newItemHandler"></new-item-entrypoint>

        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col" v-on:click="sortOn('date')">
                    <span>Date</span>
                    <sort-indicator v-bind:sortConfiguration="sortConfiguration" v-bind:attributeName="'date'" />
                </th>
                <th scope="col" v-on:click="sortOn('description')">
                    <span>Description</span>
                    <sort-indicator v-bind:sortConfiguration="sortConfiguration" v-bind:attributeName="'description'" />
                </th>
                <th scope="col" v-on:click="sortOn('amount')">
                    <span>Amount</span>
                    <sort-indicator v-bind:sortConfiguration="sortConfiguration" v-bind:attributeName="'amount'" />
                </th>
                </tr>
            </thead>
            <tbody>
                <spend-log-item 
                    @remove-item="itemRemovalHandler"
                    v-for="(item, index) in items" 
                    v-bind:key="item.id" 
                    v-bind:num="index"
                    v-bind:item="item" />
            </tbody>
        </table>


    </div>
    `
});

Vue.component('spend-log-item', {
    props: ["item", "num"],
    data: function () {
        return {
            currencyFormatter: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }),
            editionInProgress: false
        }
    },
    computed: {
        formattedValue: function () {
            return this.currencyFormatter.format(this.item.amount)
        },
        editButtonLabel: function () {
            return (this.editionInProgress ? "Save" : "Edit")
        },
        editButtonClass: function () {
            return (this.editionInProgress ? "btn-success" : "btn-primary")
        }
    },
    methods: {
        remove: function () {
            console.log("attempting to remove ", this.item.id)
            this.$emit('remove-item', this.item.id)
        },
        toggleEdit: function () {
            this.editionInProgress = !this.editionInProgress;
        }
    },
    template: `
    <tr>
        <th scope="row">{{num}}</th>
        <td>
            <label v-on:click="toggleEdit" v-if="!editionInProgress">{{item.date}}</label>
            <input type="date" v-on:keyup.enter="toggleEdit" v-if="editionInProgress" v-model="item.date"></input>
        </td>
        <td>
            <label v-on:click="toggleEdit" v-if="!editionInProgress">{{item.description}}</label>
            <input v-on:keyup.enter="toggleEdit" v-if="editionInProgress" v-model="item.description"></input>
        </td>
        <td>
            <label v-on:click="toggleEdit" v-if="!editionInProgress">{{formattedValue}}</label>
            <input v-on:keyup.enter="toggleEdit" v-if="editionInProgress" v-model="item.amount"></input>
        </td>
        <td><button v-on:click="toggleEdit" class="btn" v-bind:class="editButtonClass" >{{editButtonLabel}}</button></td>
        <td><button v-on:click="remove" class="btn btn-primary btn-warning">Delete</button></td>
    </tr>
    `
});

var vue = new Vue({
    el: '#applicationEntryPoint',
    data: {

    },
    computed: {

    },
    methods: {
    }
})