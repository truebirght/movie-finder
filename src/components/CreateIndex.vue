<template>
  <div>
    <Menu></Menu>

    <!-- container-->
    <div class="container">
      <br>
      <h1>Create Index</h1>

      <form>
        <div class="form-group row">
          <label for="inputIndexName" class="col-sm-2 col-form-label">Index 이름</label>
          <div class="col-sm-10">
            <input class="form-control" aria-label="Text input" v-model="indexName" id="inputIndexName">
          </div>
        </div>
        <div class="form-group row">
          <label for="inputIndexName" class="col-sm-2 col-form-label"></label>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="inlineRadio1" value="movie" v-model="indexName" @click="setKoreanNoriAnalyzer">
            <label class="form-check-label" for="inlineRadio1">movie</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" id="inlineRadio2" value="movie_autocomplete" v-model="indexName" @click="setKoreanJamoAnalyzer">
            <label class="form-check-label" for="inlineRadio2">movie_autocomplete</label>
          </div>
        </div>
        <div class="form-group row">
          <label for="bodyReq" class="col-sm-2 col-form-label">Body</label>
          <div class="col-sm-10">
            <textarea class="form-control" rows="35" cols="50" id="bodyReq">{{reqBody}}</textarea>
          </div>
        </div>
        <a href="javascript:;" class="btn btn-secondary router-link-exact-active router-link-active" @click="createNewIndex">생성</a>
      </form>
    </div>
    <!-- // end of container-->
  </div>

</template>

<script>
import es_cat from "../api/cat.js";
import es_indices from "../api/indices.js";
import router from "../router";

export default {
  name: "CreateIndex",
  created() {
    this.setDefaultValue();
    this.getIndexList();
  },
  data() {
    return {
      indexName: "",
      reqBody: "",
      indexList: ""
    };
  },
  methods: {
    /**
     * 화면 로딩시 기본값을 설정한다.
     */
    setDefaultValue: function() {
      this.indexName = "movie";
      this.setKoreanNoriAnalyzer();
    },
    /**
     * 인덱스 리스트를 조회한다
     */
    getIndexList: function() {
      let self = this;
      es_cat.getIndexList().then(result => {
        self.indexList = result;
      });
    },
    /**
     * 인덱스 생성을 한다.
     */
    createNewIndex: function() {
      const indexName = this.indexName;
      const reqBody = this.reqBody;
      es_indices.createIndex(indexName, reqBody).then(result => {
        if (
          typeof result !== "undefined" &&
          result !== null &&
          result.acknowledged === true
        ) {
          window.location.reload(true);
        }
      });
    },
    /**
     * 인덱스 삭제를 한다.
     * @param indexName
     */
    deleteIndex: function(indexName) {
      if (confirm(indexName + "를 정말 삭제하겠습니까?")) {
        es_indices.deleteIndex(indexName).then(result => {
          if (
            typeof result !== "undefined" &&
            result !== null &&
            result.acknowledged === true
          ) {
            window.location.reload(true);
          }
        });
      }
    },
    /**
     * 인덱스 매핑 설정을 한다.
     * @param indexName
     */
    mappingIndex: function(indexName) {
      router.push({
        name: "MappingField",
        query: { indexName: indexName }
      });
    },
    setKoreanNoriAnalyzer: function() {
      const noriAnalyzer = {
        settings: {
          index: {
            analysis: {
              analyzer: {
                korean: {
                  type: "custom",
                  tokenizer: "nori_default_tokenizer"
                }
              },
              tokenizer: {
                nori_default_tokenizer: {
                  type: "nori_tokenizer",
                  decompound_mode: "mixed",
                  user_dictionary: "userdict_ko.txt"
                }
              }
            }
          }
        }
      };

      this.reqBody = JSON.stringify(noriAnalyzer, undefined, 4);
    },
    /**
     * 한글 자모분석기를 설정한다.
     */
    setKoreanJamoAnalyzer: function() {
      const koreanJamoAnalyzer = {
        settings: {
          analysis: {
            filter: {
              javacafe_chosung: {
                type: "javacafe_chosung"
              },
              javacafe_jamo: {
                type: "javacafe_jamo"
              },
              edge100Gram: {
                type: "edgeNGram",
                min_gram: 1,
                max_gram: 100,
                side: "front"
              }
            },
            analyzer: {
              hangul_jamo_analyzer: {
                type: "custom",
                tokenizer: "keyword",
                filter: ["javacafe_jamo", "edge100Gram", "lowercase"]
              },
              hangul_jamo_analyzer: {
                type: "custom",
                tokenizer: "keyword",
                filter: ["javacafe_jamo", "edge100Gram", "lowercase"]
              },
              hangul_chosung_analyzer: {
                type: "custom",
                tokenizer: "keyword",
                filter: ["javacafe_chosung", "edge100Gram", "lowercase"]
              },
              hangul_jamo_search_analyzer: {
                type: "custom",
                tokenizer: "keyword",
                filter: ["javacafe_jamo", "lowercase"]
              },
              hangul_chosung_search_analyzer: {
                type: "custom",
                tokenizer: "keyword",
                filter: ["javacafe_chosung","lowercase"]
              }
            }
          }
        }
      };

      this.reqBody = JSON.stringify(koreanJamoAnalyzer, undefined, 4);
    }
  }
};
</script>
