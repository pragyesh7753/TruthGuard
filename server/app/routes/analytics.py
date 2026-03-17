from fastapi import APIRouter
from bigdata.spark_processing import run_spark_analysis

router = APIRouter()


@router.get("/analytics")
def get_analytics():
    data = run_spark_analysis()
    return data
