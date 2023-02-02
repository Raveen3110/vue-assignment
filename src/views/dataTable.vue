<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            hide-default-footer
            :loading="loading"
            multi-sort
            :items-per-page="page_count"
        >
            <template v-slot:[`item.avatar`]="{ item }">
                <v-avatar>
                    <v-img :src="item.avatar" />
                </v-avatar>
            </template>
        </v-data-table>
        <v-row class="pt-10">
            <v-col
                cols="12"
                sm="4"
                class="d-flex px-4"
                :class="$vuetify.breakpoint.xsOnly ? 'justify-center' : ''"
            >
                <div class="alignSelf-center footer-text mt-1 mr-2">
                    Showing {{ pageStart }} - {{ pageEnd }} of {{ total_count }}
                </div>
                <div style="width: 75px" class="alignSelf-center">
                    <v-select
                        :menu-props="{ bottom: true, offsetY: true }"
                        :items="itemsPerPageList"
                        v-model="page_count"
                        hide-details
                        dense
                        outlined
                        solo
                        flat
                        class="primary--text"
                    ></v-select>
                </div>
            </v-col>
            <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
            <v-col
                cols="12"
                sm="4"
                class="d-flex"
                :class="
                    $vuetify.breakpoint.xsOnly
                        ? 'justify-center'
                        : 'justify-end px-1'
                "
            >
                <v-pagination
                    v-model="page"
                    :length="total_pages"
                    color="primary"
                >
                </v-pagination>
            </v-col>
        </v-row>
    </div>
</template>
<script>
export default {
    name: "dataTable",
    data() {
        return {
            headers: [
                {
                    text: "ID",
                    align: "center",
                    sortable: true,
                    value: "id",
                },
                {
                    text: "Profile Picture",
                    align: "center",
                    sortable: true,
                    value: "avatar",
                },
                {
                    text: "First Name",
                    align: "Center",
                    sortable: true,
                    value: "first_name",
                },
                {
                    text: "Last Name",
                    align: "center",
                    sortable: true,
                    value: "last_name",
                },
                {
                    text: "Email",
                    align: "center",
                    sortable: true,
                    value: "email",
                },
            ],
            itemsPerPageList: [4, 8, 12],
            items: [],
            loading: false,
            page_count: 4,
            page: 1,
            total_pages: 0,
            total_count: 0,
        };
    },
    computed: {
        pageStart() {
            let start = (this.page - 1) * this.page_count + 1;
            if (start + 1 > this.total_count) start = this.total_count;
            return start;
        },
        pageEnd() {
            let end = this.pageStart + this.page_count - 1;
            if (end > this.total_count) end = this.total_count;
            return end;
        },
    },
    mounted() {
        this.getAllData();
    },
    watch: {
        page() {
            this.getAllData();
        },
        page_count() {
            this.getAllData();
        },
    },
    methods: {
        getAllData() {
            this.loading = true;
            let formData = {};
            formData["page"] = this.page;
            formData["per_page"] = this.page_count;
            const successHandler = (res) => {
                this.items = res.data.data;
                this.total_pages = res.data.total_pages;
                this.total_count = res.data.total;
                this.page = res.data.page;
                this.page_count = res.data.per_page;
                this.loading = false;
            };

            return this.$request("get", "https://reqres.in/api/users", {
                params: formData,
                onSuccess: successHandler,
            });
        },
    },
};
</script>
<style scoped>
.alignSelf-center {
    align-self: center;
}
.footer-text {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: #333333;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding: 10px 0;
}
.v-data-table >>> .v-data-table__wrapper > table > thead > tr > th {
    font-weight: normal;
    color: black;
}
</style>
